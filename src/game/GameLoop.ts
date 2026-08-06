import { Note, BeatmapData, GameStats, CostumeId } from '../types/game';
import { audioEngine } from './AudioEngine';
import { RenderEngine } from './RenderEngine';

export class GameLoop {
  private renderEngine: RenderEngine;
  private currentBeatmap: BeatmapData;
  private costume: CostumeId;
  private difficulty: 'Easy' | 'Normal' | 'Hard';
  private animFrameId: number | null = null;
  private isPausedState: boolean = false;

  private activeTrack: 'air' | 'ground' = 'ground';

  private stats: GameStats = {
    score: 0,
    supportRate: 100,
    combo: 0,
    maxCombo: 0,
    perfectCount: 0,
    greatCount: 0,
    missCount: 0,
    feverGauge: 0,
    isFeverActive: false
  };

  private notes: Note[] = [];
  private inputState = { airActive: false, groundActive: false };

  private onStatsChange?: (stats: GameStats) => void;
  private onGameOver?: (stats: GameStats) => void;

  constructor(
    renderEngine: RenderEngine,
    beatmap: BeatmapData,
    costume: CostumeId,
    difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal',
    onStatsChange?: (stats: GameStats) => void,
    onGameOver?: (stats: GameStats) => void
  ) {
    this.renderEngine = renderEngine;
    this.currentBeatmap = beatmap;
    this.costume = costume;
    this.difficulty = difficulty;
    this.onStatsChange = onStatsChange;
    this.onGameOver = onGameOver;

    this.notes = JSON.parse(JSON.stringify(beatmap.notes));
  }

  public async start(): Promise<void> {
    const bgmBuf = await audioEngine.loadDefaultBGM();
    
    if (bgmBuf) {
      const detected = audioEngine.detectBeatsFromBuffer(bgmBuf, this.difficulty);
      if (detected.length > 0) {
        this.notes = detected;
      }
    }

    audioEngine.playBGM(0);
    this.isPausedState = false;
    this.loop();
  }

  public pause(): void {
    this.isPausedState = true;
    audioEngine.pauseBGM();
  }

  public resume(): void {
    if (!this.isPausedState) return;
    this.isPausedState = false;
    const offset = audioEngine.getHardwareTime();
    audioEngine.playBGM(offset);
  }

  public stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    audioEngine.stopBGM();
  }

  public triggerKeyInput(track: 'air' | 'ground'): void {
    if (this.isPausedState) return;
    const currentTime = audioEngine.getHardwareTime();

    // Switch Hero Runway Track Position (Air vs Ground)
    this.activeTrack = track;

    if (track === 'air') this.inputState.airActive = true;
    if (track === 'ground') this.inputState.groundActive = true;

    setTimeout(() => {
      if (track === 'air') this.inputState.airActive = false;
      if (track === 'ground') this.inputState.groundActive = false;
    }, 120);

    const windowSec = 0.21;
    let closestNote: Note | null = null;
    let minDiff = Infinity;

    for (const note of this.notes) {
      if (note.hit || note.track !== track) continue;

      if (note.isMash) {
        const diff = Math.abs(note.time - currentTime);
        if (diff <= 0.45) {
          closestNote = note;
          minDiff = diff;
          break;
        }
      }

      const diff = Math.abs(note.time - currentTime);
      if (diff <= windowSec && diff < minDiff) {
        minDiff = diff;
        closestNote = note;
      }
    }

    if (closestNote) {
      if (closestNote.isMash) {
        const scoreAdd = this.stats.isFeverActive ? 160 : 80;
        this.stats.score += scoreAdd;
        this.stats.combo += 1;
        if (this.stats.combo > this.stats.maxCombo) this.stats.maxCombo = this.stats.combo;

        audioEngine.playSFX('perfect');
        const hitX = this.renderEngine['canvas'].width * 0.22;
        const hitY = track === 'air' ? this.renderEngine['canvas'].height * 0.38 : this.renderEngine['canvas'].height * 0.72;
        this.renderEngine.triggerHitEffect(hitX, hitY, `🔥 MASH! +${scoreAdd}`, true);
        if (this.onStatsChange) this.onStatsChange({ ...this.stats });
        return;
      }

      closestNote.hit = true;
      let judgement: 'perfect' | 'great' = 'great';
      let scoreAdd = 60;

      if (minDiff <= 0.065) {
        judgement = 'perfect';
        scoreAdd = 100;
      }

      if (closestNote.isDual) {
        scoreAdd = 200;
      }

      if (this.costume === 'office_glasses') {
        scoreAdd = Math.floor(scoreAdd * 1.2);
      }

      if (this.stats.isFeverActive) {
        scoreAdd *= 2;
      }

      closestNote.judgement = judgement;
      this.stats.score += scoreAdd;
      this.stats.combo += 1;
      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }

      if (judgement === 'perfect') {
        this.stats.perfectCount++;
        audioEngine.playSFX(closestNote.isDual ? 'cheer' : 'perfect');
      } else {
        this.stats.greatCount++;
        audioEngine.playSFX('swish');
      }

      const feverInc = this.costume === 'kpop_idol' ? 12 : 6;
      this.stats.feverGauge = Math.min(100, this.stats.feverGauge + feverInc);
      if (this.stats.feverGauge >= 100 && !this.stats.isFeverActive) {
        this.activateFever();
      }

      const hitX = this.renderEngine['canvas'].width * 0.22;
      const hitY = track === 'air' ? this.renderEngine['canvas'].height * 0.38 : this.renderEngine['canvas'].height * 0.72;
      const hitText = closestNote.isDual ? `⚡ DUAL! +${scoreAdd} 票` : `+${scoreAdd} 票`;
      this.renderEngine.triggerHitEffect(hitX, hitY, hitText, judgement === 'perfect');

      if (this.onStatsChange) this.onStatsChange({ ...this.stats });
    }
  }

  private activateFever(): void {
    this.stats.isFeverActive = true;
    audioEngine.playSFX('cheer');
    setTimeout(() => {
      this.stats.isFeverActive = false;
      this.stats.feverGauge = 0;
      if (this.onStatsChange) this.onStatsChange({ ...this.stats });
    }, 6000);
  }

  private loop = (): void => {
    if (this.isPausedState) {
      this.animFrameId = requestAnimationFrame(this.loop);
      return;
    }

    const currentTime = audioEngine.getHardwareTime();

    for (const note of this.notes) {
      if (!note.hit && (currentTime - note.time) > 0.21) {
        note.hit = true;
        note.judgement = 'miss';
        this.stats.missCount++;
        this.stats.combo = 0;

        const missPen = this.costume === 'campaign_vest' ? 4 : 6;
        this.stats.supportRate = Math.max(0, this.stats.supportRate - missPen);
        audioEngine.playSFX('error');

        if (this.stats.supportRate <= 0) {
          this.stop();
          if (this.onGameOver) this.onGameOver({ ...this.stats });
          return;
        }

        if (this.onStatsChange) this.onStatsChange({ ...this.stats });
      }
    }

    this.renderEngine.render(
      currentTime,
      this.notes,
      this.costume,
      this.stats,
      this.inputState,
      this.activeTrack
    );

    const lastNote = this.notes[this.notes.length - 1];
    if (lastNote && currentTime > lastNote.time + 2.5) {
      this.stop();
      if (this.onGameOver) this.onGameOver({ ...this.stats });
      return;
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };
}
