import { Note, BeatmapData, GameStats, CostumeId } from '../types/game';
import { SONG_REGISTRY, SongData } from './SongRegistry';
import { audioEngine } from './AudioEngine';
import { RenderEngine } from './RenderEngine';
import { GamepadController } from './GamepadController';

export class GameLoop {
  private renderEngine: RenderEngine;
  private currentBeatmap: BeatmapData;
  private songData: SongData;
  private costume: CostumeId;
  private difficulty: 'Easy' | 'Normal' | 'Hard';
  private speedMultiplier: number;
  private animFrameId: number | null = null;
  private isPausedState: boolean = false;
  private totalAudioDuration: number = 180;

  private activeTrack: 'air' | 'ground' = 'ground';
  private resumeCountdown: number = 0;
  private resumeTimerId: ReturnType<typeof setInterval> | null = null;
  private gamepadController: GamepadController;

  private stats: GameStats = {
    score: 0,
    supportRate: 100,
    combo: 0,
    maxCombo: 0,
    perfectCount: 0,
    greatCount: 0,
    missCount: 0,
    feverGauge: 0,
    isFeverActive: false,
    totalNotesCount: 0
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
    speedMultiplier: number = 1.0,
    songData?: SongData,
    onStatsChange?: (stats: GameStats) => void,
    onGameOver?: (stats: GameStats) => void
  ) {
    this.renderEngine = renderEngine;
    this.currentBeatmap = beatmap;
    this.songData = songData || SONG_REGISTRY[0];
    this.costume = costume;
    this.difficulty = difficulty;
    this.speedMultiplier = speedMultiplier;
    this.onStatsChange = onStatsChange;
    this.onGameOver = onGameOver;

    this.notes = JSON.parse(JSON.stringify(beatmap.notes));
    this.stats.totalNotesCount = this.notes.filter(n => n.type !== 'obstacle').length;

    // Native Gamepad Controller Setup
    this.gamepadController = new GamepadController(
      () => this.triggerKeyInput('air'),
      () => this.triggerKeyInput('ground'),
      () => this.pause()
    );
  }

  public async start(): Promise<void> {
    const audioUrl = this.songData.audio || '/assets/audio/campaign_start.mp3';
    const bgmBuf = await audioEngine.loadAudioFromUrl(audioUrl);
    
    if (bgmBuf) {
      this.totalAudioDuration = bgmBuf.duration;
      const detected = audioEngine.detectBeatsFromBuffer(bgmBuf, this.difficulty);
      if (detected.length > 0) {
        this.notes = detected;
        this.stats.totalNotesCount = this.notes.filter(n => n.type !== 'obstacle').length;
      }
    }

    audioEngine.playBGM(0);
    this.isPausedState = false;
    this.loop();
  }

  public pause(): void {
    this.isPausedState = true;
    if (this.resumeTimerId) {
      clearInterval(this.resumeTimerId);
      this.resumeTimerId = null;
    }
    audioEngine.pauseBGM();
  }

  public resume(): void {
    if (!this.isPausedState) return;

    this.resumeCountdown = 5;
    if (this.resumeTimerId) clearInterval(this.resumeTimerId);

    this.resumeTimerId = setInterval(() => {
      this.resumeCountdown -= 1;
      if (this.resumeCountdown <= 0) {
        if (this.resumeTimerId) {
          clearInterval(this.resumeTimerId);
          this.resumeTimerId = null;
        }
        audioEngine.playBGM(audioEngine.getHardwareTime());
        this.isPausedState = false;
        this.loop();
      }
    }, 1000);
  }

  public stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.resumeTimerId) {
      clearInterval(this.resumeTimerId);
      this.resumeTimerId = null;
    }
    audioEngine.stopBGM();
  }

  public triggerKeyInput(track: 'air' | 'ground'): void {
    if (this.isPausedState) return;
    this.activeTrack = track;
    if (track === 'air') {
      this.inputState.airActive = true;
      setTimeout(() => { this.inputState.airActive = false; }, 120);
    } else {
      this.inputState.groundActive = true;
      setTimeout(() => { this.inputState.groundActive = false; }, 120);
    }

    audioEngine.playSFX('swish');
    this.checkHitJudgement(track);
  }

  private checkHitJudgement(track: 'air' | 'ground'): void {
    const currentTime = audioEngine.getHardwareTime();
    const activeNotes = this.notes.filter(n => !n.hit);

    let closestNote: Note | null = null;
    let minDiff = Infinity;

    // 🛡️ Strict Track Filtering: Player key input on 'track' ONLY checks notes belonging strictly to 'track'!
    for (const note of activeNotes) {
      if (note.track === track) {
        const diff = Math.abs(note.time - currentTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestNote = note;
        }
      }
    }

    if (!closestNote) return;

    // Calibrated Hit Window Tolerances (Hit Precision = ±0.14s)
    if (minDiff <= 0.14) {
      closestNote.hit = true;

      // Direct Obstacle Hit: Player deliberately pressed the SAME track button where obstacle is located!
      if (closestNote.type === 'obstacle' || closestNote.entity.startsWith('hater')) {
        const hitX = Math.max(150, this.renderEngine['canvas'].width * 0.20);
        const hitY = track === 'air' ? this.renderEngine['canvas'].height * 0.36 : this.renderEngine['canvas'].height * 0.70;
        
        this.stats.supportRate = Math.max(0, this.stats.supportRate - 6);
        this.stats.combo = 0;
        this.stats.missCount += 1;
        
        audioEngine.playSFX('error');
        audioEngine.triggerHapticVibration('damage');
        this.renderEngine.triggerHitEffect(hitX, hitY, '❌ HATER HIT!', 'damage');
        this.notifyStatsChange();
        return;
      }

      let judgement: 'perfect' | 'great' = 'great';
      let scoreAdd = 100;

      if (minDiff <= 0.055) {
        judgement = 'perfect';
        scoreAdd = 200;
        this.stats.perfectCount += 1;
      } else {
        this.stats.greatCount += 1;
      }

      if (this.costume === 'office_glasses') {
        scoreAdd = Math.floor(scoreAdd * 1.2);
      }

      if (this.stats.isFeverActive) {
        scoreAdd *= 2;
      }

      this.stats.score += scoreAdd;
      this.stats.combo += 1;
      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }

      audioEngine.playSFX(judgement === 'perfect' ? 'perfect' : 'cheer');
      audioEngine.triggerHapticVibration(closestNote.isDual ? 'dual' : 'hit');

      const feverInc = this.costume === 'kpop_idol' ? 12 : 6;
      this.stats.feverGauge = Math.min(100, this.stats.feverGauge + feverInc);
      if (this.stats.feverGauge >= 100 && !this.stats.isFeverActive) {
        this.activateFever();
      }

      const hitX = Math.max(150, this.renderEngine['canvas'].width * 0.20);
      const hitY = track === 'air' ? this.renderEngine['canvas'].height * 0.36 : this.renderEngine['canvas'].height * 0.70;
      const hitText = closestNote.isDual ? `⚡ DUAL! +${scoreAdd} 票` : `+${scoreAdd} 票`;
      this.renderEngine.triggerHitEffect(hitX, hitY, hitText, judgement);

      this.notifyStatsChange();
    }
  }

  private activateFever(): void {
    this.stats.isFeverActive = true;
    audioEngine.playSFX('cheer');
    audioEngine.triggerHapticVibration('dual');

    setTimeout(() => {
      this.stats.isFeverActive = false;
      this.stats.feverGauge = 0;
      this.notifyStatsChange();
    }, 6000);
  }

  private loop = (): void => {
    if (this.isPausedState) return;

    const currentTime = audioEngine.getHardwareTime();

    // Poll Gamepad Input State Every Frame
    this.gamepadController.update();

    // Check Auto Miss Notes & Obstacle Dodge Resolution
    for (const note of this.notes) {
      if (!note.hit && note.time < currentTime - 0.18) {
        note.hit = true;
        
        if (note.type === 'obstacle' || note.entity.startsWith('hater')) {
          // 🛡️ Obstacle Collision Rule: ONLY damages player if Yoaka is currently on the SAME track as the obstacle!
          if (note.track === this.activeTrack) {
            const hitX = Math.max(150, this.renderEngine['canvas'].width * 0.20);
            const hitY = note.track === 'air' ? this.renderEngine['canvas'].height * 0.36 : this.renderEngine['canvas'].height * 0.70;
            
            this.stats.supportRate = Math.max(0, this.stats.supportRate - 6);
            this.stats.combo = 0;
            this.stats.missCount += 1;
            
            audioEngine.playSFX('error');
            audioEngine.triggerHapticVibration('damage');
            this.renderEngine.triggerHitEffect(hitX, hitY, '❌ HATER HIT!', 'damage');
            this.notifyStatsChange();
          }
          // If note.track !== this.activeTrack: Player successfully DODGED! Zero penalty & zero miss count!
        } else {
          // Normal voter note missed
          this.stats.combo = 0;
          this.stats.missCount += 1;
          
          if (this.costume === 'office_glasses') {
            this.stats.supportRate = Math.max(0, this.stats.supportRate - 4);
          } else {
            this.stats.supportRate = Math.max(0, this.stats.supportRate - 6);
          }

          audioEngine.playSFX('error');
          this.notifyStatsChange();
        }
      }
    }

    // Render Stage Frame
    this.renderEngine.render(
      currentTime,
      this.notes,
      this.costume,
      this.stats,
      this.inputState,
      this.activeTrack,
      this.speedMultiplier
    );

    // Game End Trigger (All notes finished or time reached)
    if (currentTime >= this.totalAudioDuration - 0.5 || this.stats.supportRate <= 0) {
      this.stop();
      if (this.onGameOver) {
        this.onGameOver(this.stats);
      }
      return;
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private notifyStatsChange(): void {
    if (this.onStatsChange) {
      this.onStatsChange({ ...this.stats });
    }
  }
}
