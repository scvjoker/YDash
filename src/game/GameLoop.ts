import { Note, BeatmapData, GameStats, CostumeId } from '../types/game';
import { audioEngine } from './AudioEngine';
import { RenderEngine } from './RenderEngine';
import { TUTORIAL_PHASES_DATA, TutorialPhaseInfo } from '../components/TutorialOverlay';

export class GameLoop {
  private renderEngine: RenderEngine;
  private currentBeatmap: BeatmapData;
  private costume: CostumeId;
  private difficulty: 'Easy' | 'Normal' | 'Hard';
  private speedMultiplier: number;
  private animFrameId: number | null = null;
  private isPausedState: boolean = false;

  private activeTrack: 'air' | 'ground' = 'ground';
  private resumeCountdown: number = 0;
  private resumeTimerId: ReturnType<typeof setInterval> | null = null;

  // Tutorial Mode State & Phase Repeat Tracking
  public isTutorialMode: boolean = false;
  public tutorialPhase: number = 1;
  public tutorialPhaseProgress: number = 0;
  public isTutorialCompleted: boolean = false;
  private onTutorialPhaseChange?: (info: TutorialPhaseInfo) => void;

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
    onStatsChange?: (stats: GameStats) => void,
    onGameOver?: (stats: GameStats) => void,
    isTutorialMode: boolean = false,
    onTutorialPhaseChange?: (info: TutorialPhaseInfo) => void
  ) {
    this.renderEngine = renderEngine;
    this.currentBeatmap = beatmap;
    this.costume = costume;
    this.difficulty = difficulty;
    this.speedMultiplier = speedMultiplier;
    this.onStatsChange = onStatsChange;
    this.onGameOver = onGameOver;
    this.isTutorialMode = isTutorialMode;
    this.onTutorialPhaseChange = onTutorialPhaseChange;

    this.notes = JSON.parse(JSON.stringify(beatmap.notes));
    this.stats.totalNotesCount = this.notes.filter(n => n.type !== 'obstacle').length;

    if (this.isTutorialMode) {
      this.setupTutorialPhaseNotes(1);
    }
  }

  private setupTutorialPhaseNotes(phase: number): void {
    this.tutorialPhase = phase;
    this.tutorialPhaseProgress = 0;
    this.notes = [];

    // Synthesize Repeat Audio for Tutorial Phase
    audioEngine.playTutorialPhaseRepeatLoop(phase);

    // Generate repeating note waves for current tutorial phase
    const now = audioEngine.getHardwareTime();
    if (phase === 1) { // Air Voter
      for (let i = 1; i <= 20; i++) {
        this.notes.push({
          id: `tut_1_${i}`,
          time: now + i * 1.8,
          track: 'air',
          type: 'voter',
          entity: 'voter_student'
        });
      }
    } else if (phase === 2) { // Ground Voter
      for (let i = 1; i <= 20; i++) {
        this.notes.push({
          id: `tut_2_${i}`,
          time: now + i * 1.8,
          track: 'ground',
          type: 'voter',
          entity: 'voter_office'
        });
      }
    } else if (phase === 3) { // Dual Strike
      for (let i = 1; i <= 20; i++) {
        this.notes.push({
          id: `tut_3_air_${i}`,
          time: now + i * 2.2,
          track: 'air',
          type: 'voter',
          entity: 'voter_student',
          isDual: true
        });
        this.notes.push({
          id: `tut_3_gnd_${i}`,
          time: now + i * 2.2,
          track: 'ground',
          type: 'voter',
          entity: 'voter_office',
          isDual: true
        });
      }
    } else if (phase === 4) { // Dodge Hater
      for (let i = 1; i <= 20; i++) {
        this.notes.push({
          id: `tut_4_${i}`,
          time: now + i * 2.0,
          track: i % 2 === 0 ? 'air' : 'ground',
          type: 'obstacle',
          entity: i % 2 === 0 ? 'hater_dog_board' : 'hater_shark'
        });
      }
    } else if (phase === 5) { // Fever Mode
      this.stats.feverGauge = 100;
      this.activateFever();
      for (let i = 1; i <= 20; i++) {
        this.notes.push({
          id: `tut_5_${i}`,
          time: now + i * 1.5,
          track: i % 2 === 0 ? 'air' : 'ground',
          type: 'voter',
          entity: 'voter_student'
        });
      }
    }

    this.notifyTutorialPhase();
  }

  public nextTutorialPhase(): void {
    if (!this.isTutorialMode) return;
    if (this.tutorialPhase >= 5) {
      this.isTutorialCompleted = true;
      this.notifyTutorialPhase();
    } else {
      this.setupTutorialPhaseNotes(this.tutorialPhase + 1);
    }
  }

  private notifyTutorialPhase(): void {
    if (this.onTutorialPhaseChange) {
      const data = TUTORIAL_PHASES_DATA[this.tutorialPhase - 1] || TUTORIAL_PHASES_DATA[0];
      this.onTutorialPhaseChange({
        phase: this.tutorialPhase,
        title: data.title,
        instruction: data.instruction,
        keyHint: data.keyHint,
        targetCount: data.targetCount,
        currentCount: this.tutorialPhaseProgress
      });
    }
  }

  public async start(): Promise<void> {
    if (this.isTutorialMode) {
      this.setupTutorialPhaseNotes(1);
      this.isPausedState = false;
      this.loop();
      return;
    }

    const bgmBuf = await audioEngine.loadDefaultBGM();
    
    if (bgmBuf) {
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
        this.isPausedState = false;
        if (this.isTutorialMode) {
          audioEngine.playTutorialPhaseRepeatLoop(this.tutorialPhase);
        } else {
          const offset = audioEngine.getHardwareTime();
          audioEngine.playBGM(offset);
        }
      }
    }, 1000);
  }

  public stop(): void {
    if (this.resumeTimerId) {
      clearInterval(this.resumeTimerId);
      this.resumeTimerId = null;
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    audioEngine.stopBGM();
  }

  public triggerKeyInput(track: 'air' | 'ground'): void {
    if (this.isPausedState || this.resumeCountdown > 0) return;
    const currentTime = audioEngine.getHardwareTime();

    this.activeTrack = track;

    if (track === 'air') this.inputState.airActive = true;
    if (track === 'ground') this.inputState.groundActive = true;

    setTimeout(() => {
      if (track === 'air') this.inputState.airActive = false;
      if (track === 'ground') this.inputState.groundActive = false;
    }, 120);

    const windowSec = 0.25;
    let closestNote: Note | null = null;
    let minDiff = Infinity;

    for (const note of this.notes) {
      if (note.hit || note.track !== track || note.type === 'obstacle') continue;

      const diff = Math.abs(note.time - currentTime);
      if (diff <= windowSec && diff < minDiff) {
        minDiff = diff;
        closestNote = note;
      }
    }

    if (closestNote) {
      closestNote.hit = true;
      let judgement: 'perfect' | 'great' = 'great';
      let scoreAdd = 60;

      if (minDiff <= 0.075) {
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

      // Tutorial Phase Progress Counter Tracking
      if (this.isTutorialMode) {
        this.tutorialPhaseProgress++;
        this.notifyTutorialPhase();

        const currentTarget = TUTORIAL_PHASES_DATA[this.tutorialPhase - 1]?.targetCount || 2;
        if (this.tutorialPhaseProgress >= currentTarget) {
          setTimeout(() => this.nextTutorialPhase(), 300);
        }
      }

      const feverInc = this.costume === 'kpop_idol' ? 12 : 6;
      this.stats.feverGauge = Math.min(100, this.stats.feverGauge + feverInc);
      if (this.stats.feverGauge >= 100 && !this.stats.isFeverActive) {
        this.activateFever();
      }

      const hitX = this.renderEngine['canvas'].width * 0.22;
      const hitY = track === 'air' ? this.renderEngine['canvas'].height * 0.36 : this.renderEngine['canvas'].height * 0.70;
      const hitText = closestNote.isDual ? `⚡ DUAL! +${scoreAdd} 票` : `+${scoreAdd} 票`;
      this.renderEngine.triggerHitEffect(hitX, hitY, hitText, judgement);

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
    if (this.isPausedState && this.resumeCountdown <= 0) {
      this.animFrameId = requestAnimationFrame(this.loop);
      return;
    }

    const currentTime = audioEngine.getHardwareTime();

    // Render 5.0s Lead-In / Unpause Countdown Text (h * 0.24)
    if (this.resumeCountdown > 0) {
      this.renderEngine.render(
        currentTime,
        this.notes,
        this.costume,
        this.stats,
        this.inputState,
        this.activeTrack,
        this.speedMultiplier
      );

      const ctx = this.renderEngine['ctx'];
      const w = this.renderEngine['canvas'].width;
      const h = this.renderEngine['canvas'].height;
      const scale = Math.min(1.8, Math.max(0.60, h / 640));

      ctx.save();
      ctx.fillStyle = 'rgba(7, 8, 20, 0.65)';
      ctx.fillRect(0, 0, w, h);

      ctx.font = `900 ${Math.floor(34 * scale)}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#ffe600';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 20 * scale;
      ctx.fillText(`⚡ 準備續走拜票！倒數 ${this.resumeCountdown} 秒 ⚡`, w / 2, h * 0.24);
      ctx.restore();

      this.animFrameId = requestAnimationFrame(this.loop);
      return;
    }

    // 1. Process Hater Obstacles
    for (const note of this.notes) {
      if (!note.hit && note.type === 'obstacle') {
        if (currentTime >= note.time) {
          note.hit = true;
          if (this.activeTrack === note.track) {
            this.stats.missCount++;
            this.stats.combo = 0;
            const missPen = this.costume === 'campaign_vest' ? 4 : 6;
            this.stats.supportRate = Math.max(0, this.stats.supportRate - missPen);
            audioEngine.playSFX('error');

            const hitX = this.renderEngine['canvas'].width * 0.22;
            const hitY = note.track === 'air' ? this.renderEngine['canvas'].height * 0.36 : this.renderEngine['canvas'].height * 0.70;
            this.renderEngine.triggerHitEffect(hitX, hitY, `❌ HIT!`, 'damage');

            if (this.stats.supportRate <= 0) {
              this.stop();
              if (this.onGameOver) this.onGameOver({ ...this.stats });
              return;
            }
          } else {
            const hitX = this.renderEngine['canvas'].width * 0.22;
            const hitY = note.track === 'air' ? this.renderEngine['canvas'].height * 0.36 : this.renderEngine['canvas'].height * 0.70;
            this.renderEngine.triggerHitEffect(hitX, hitY, `✨ DODGE!`, 'dodge');

            if (this.isTutorialMode && this.tutorialPhase === 4) {
              this.tutorialPhaseProgress++;
              this.notifyTutorialPhase();
              if (this.tutorialPhaseProgress >= 2) {
                setTimeout(() => this.nextTutorialPhase(), 300);
              }
            }
          }
          if (this.onStatsChange) this.onStatsChange({ ...this.stats });
        }
      }
      
      // 2. Process Missed Voter Notes
      else if (!note.hit && note.type !== 'obstacle' && (currentTime - note.time) > 0.25) {
        note.hit = true;
        note.judgement = 'miss';
        this.stats.missCount++;
        this.stats.combo = 0;

        const missPen = this.costume === 'campaign_vest' ? 4 : 6;
        this.stats.supportRate = Math.max(0, this.stats.supportRate - missPen);
        audioEngine.playSFX('error');

        this.renderEngine.triggerDamageEffect();

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
      this.activeTrack,
      this.speedMultiplier
    );

    if (!this.isTutorialMode) {
      const lastNote = this.notes[this.notes.length - 1];
      if (lastNote && currentTime > lastNote.time + 2.5) {
        this.stop();
        if (this.onGameOver) this.onGameOver({ ...this.stats });
        return;
      }
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };
}
