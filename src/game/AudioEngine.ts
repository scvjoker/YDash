export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private bgmBuffer: AudioBuffer | null = null;
  private customAudioBuffer: AudioBuffer | null = null;

  private currentBgmSource: AudioBufferSourceNode | null = null;
  private previewBgmSource: AudioBufferSourceNode | null = null;

  private bgmStartTime: number = 0;
  private bgmPauseOffset: number = 0;
  private isBgmPlaying: boolean = false;

  private activeAudioUrl: string | null = null;
  private currentPreviewToken: number = 0;

  // Global Settings for SFX and Haptic Vibration
  public isSfxEnabled: boolean = true;
  public isVibrationEnabled: boolean = true;

  constructor() {
    // Lazy AudioContext initialization
  }

  private initCtx(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public stopAllAudio(): void {
    this.stopBGM();
    this.stopPreview();
  }

  public setCustomAudioBuffer(buffer: AudioBuffer): void {
    this.customAudioBuffer = buffer;
  }

  public clearCustomAudioBuffer(): void {
    this.customAudioBuffer = null;
  }

  public getLoadedAudioBuffer(): AudioBuffer | null {
    return this.customAudioBuffer || this.bgmBuffer;
  }

  public async loadDefaultBGM(): Promise<AudioBuffer | null> {
    return this.loadAudioFromUrl('/assets/audio/campaign_start.mp3');
  }

  public async loadAudioFromUrl(url: string): Promise<AudioBuffer | null> {
    const ctx = this.initCtx();

    if (this.activeAudioUrl === url && this.customAudioBuffer) {
      return this.customAudioBuffer;
    }

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
      const arrayBuf = await resp.arrayBuffer();
      const decodedBuf = await ctx.decodeAudioData(arrayBuf);
      this.customAudioBuffer = decodedBuf;
      this.activeAudioUrl = url;
      return decodedBuf;
    } catch (err) {
      console.warn(`Failed to load audio from ${url}`, err);
      return null;
    }
  }

  public async playPreviewFromUrl(url: string): Promise<number | null> {
    const ctx = this.initCtx();
    
    // Stop all ongoing main BGM and previous preview to guarantee NO OVERLAP CONFLICT!
    this.stopAllAudio();

    // Increment preview token to cancel out-of-order async loads
    const thisToken = ++this.currentPreviewToken;

    try {
      const buffer = await this.loadAudioFromUrl(url);
      if (!buffer) return null;

      // Discard if user already clicked another song card during fetch/decode
      if (thisToken !== this.currentPreviewToken) {
        return null;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.75, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Play 15-second Preview from middle of the song (e.g. 20% timestamp offset)
      const startOffset = Math.min(15, buffer.duration * 0.2);
      source.start(0, startOffset, 15);
      this.previewBgmSource = source;

      return Math.round(buffer.duration);
    } catch (e) {
      console.warn('Failed to play preview', e);
      return null;
    }
  }

  public stopPreview(): void {
    this.currentPreviewToken++;
    if (this.previewBgmSource) {
      try {
        this.previewBgmSource.stop();
        this.previewBgmSource.disconnect();
      } catch (e) {}
      this.previewBgmSource = null;
    }
  }

  /**
   * 🎼 AI Automatic Beatmap Recognition with Dual Note Pacing Buffer & Full Track Coverage
   */
  public detectBeatsFromBuffer(buffer: AudioBuffer, difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal'): any[] {
    const channelData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    const frameSize = 1024;
    const hopSize = 512;
    const energyList: { time: number; energy: number; isBass: boolean }[] = [];

    for (let i = 0; i < channelData.length - frameSize; i += hopSize) {
      let sum = 0;
      let bassSum = 0;

      for (let j = 0; j < frameSize; j++) {
        const sample = channelData[i + j];
        sum += sample * sample;
        if (j < frameSize / 4) {
          bassSum += sample * sample;
        }
      }

      const time = i / sampleRate;
      energyList.push({
        time,
        energy: Math.sqrt(sum / frameSize),
        isBass: bassSum > sum * 0.45
      });
    }

    // 🎯 Quantized AI Difficulty Rules
    let minEnergyThreshold = 0.20;
    let minTimeGap = 0.32;
    let dualChance = 0.10;
    let obstacleChance = 0.08;
    let maxSameTrackStreak = 2;

    if (difficulty === 'Easy') {
      minEnergyThreshold = 0.32;
      minTimeGap = 0.48; // Max ~2 notes per second
      dualChance = 0.00; // No dual notes on Easy
      obstacleChance = 0.05;
      maxSameTrackStreak = 1; // Strict 1:1 alternate
    } else if (difficulty === 'Hard') {
      minEnergyThreshold = 0.15;
      minTimeGap = 0.25; // Smoothed Hard gap (4.0 notes/sec instead of 5.0)
      dualChance = 0.15;
      obstacleChance = 0.12;
      maxSameTrackStreak = 2;
    }

    const notes: any[] = [];
    let lastNoteTime = -1;
    let lastObstacleTime = -10.0;
    let lastTrack: 'air' | 'ground' = 'ground';
    let sameTrackStreak = 0;

    // Minimum Obstacle Safety Window: At least 2.5x minimum beat gap (and >= 0.75s)
    const minObstacleSafetyGap = Math.max(0.75, minTimeGap * 2.5);

    for (let i = 2; i < energyList.length - 2; i++) {
      const prev = energyList[i - 1].energy;
      const currItem = energyList[i];
      const curr = currItem.energy;
      const next = energyList[i + 1].energy;

      if (curr > minEnergyThreshold && curr > prev && curr > next) {
        if (currItem.time - lastNoteTime >= minTimeGap && currItem.time >= 5.0) {
          let track: 'air' | 'ground' = currItem.isBass ? 'ground' : 'air';

          // 🛡️ Smart Alternate Distribution: Prevent single-track overcrowding to stop misclicks!
          const timeSinceLast = currItem.time - lastNoteTime;
          if (track === lastTrack) {
            sameTrackStreak++;
          } else {
            sameTrackStreak = 1;
          }

          if (sameTrackStreak > maxSameTrackStreak || timeSinceLast < 0.38) {
            track = lastTrack === 'air' ? 'ground' : 'air';
            sameTrackStreak = 1;
          }

          lastTrack = track;

          const isDual = Math.random() < dualChance;

          // 🛡️ Safe Obstacle Pacing: Must be separated by at least 2.5x min beat gap!
          const isObstacleAllowed = (currItem.time - lastObstacleTime >= minObstacleSafetyGap);
          const isObstacle = isObstacleAllowed && (Math.random() < obstacleChance);

          if (isObstacle) {
            notes.push({
              time: currItem.time,
              track,
              type: 'obstacle',
              entity: track === 'air' ? 'hater_dog_board' : 'hater_shark'
            });
            lastObstacleTime = currItem.time;
            lastNoteTime = currItem.time;
          } else if (isDual) {
            notes.push({
              time: currItem.time,
              track: 'air',
              type: 'normal',
              entity: 'tissue_pack',
              isDual: true
            });
            notes.push({
              time: currItem.time,
              track: 'ground',
              type: 'normal',
              entity: 'tissue_pack',
              isDual: true
            });
            // 🛡️ Dual Note Safety Buffer: Extra cooldown after dual note to prevent crowding
            lastNoteTime = currItem.time + minTimeGap * 0.5;
          } else {
            notes.push({
              time: currItem.time,
              track,
              type: 'normal',
              entity: 'tissue_pack'
            });
            lastNoteTime = currItem.time;
          }
        }
      }
    }

    return notes;
  }

  public playBGM(offsetSec: number = 0): void {
    const ctx = this.initCtx();
    this.stopAllAudio();

    const activeBuf = this.customAudioBuffer || this.bgmBuffer;
    if (!activeBuf) return;

    this.currentBgmSource = ctx.createBufferSource();
    this.currentBgmSource.buffer = activeBuf;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.85, ctx.currentTime);

    this.currentBgmSource.connect(gainNode);
    gainNode.connect(ctx.destination);

    this.bgmStartTime = ctx.currentTime - offsetSec;
    this.currentBgmSource.start(0, offsetSec);
    this.isBgmPlaying = true;
  }

  public pauseBGM(): void {
    if (this.currentBgmSource && this.isBgmPlaying) {
      try {
        this.currentBgmSource.stop();
        this.currentBgmSource.disconnect();
      } catch (e) {}
      this.bgmPauseOffset = this.getHardwareTime();
      this.isBgmPlaying = false;
      this.currentBgmSource = null;
    }
  }

  public stopBGM(): void {
    if (this.currentBgmSource) {
      try {
        this.currentBgmSource.stop();
        this.currentBgmSource.disconnect();
      } catch (e) {}
      this.currentBgmSource = null;
    }
    this.isBgmPlaying = false;
    this.bgmPauseOffset = 0;
  }

  public getHardwareTime(): number {
    if (!this.isBgmPlaying) return this.bgmPauseOffset;
    if (!this.audioCtx) return 0;
    return Math.max(0, this.audioCtx.currentTime - this.bgmStartTime);
  }

  // Trigger Mobile Haptic Vibration Feedback
  public triggerHapticVibration(type: 'hit' | 'dual' | 'damage'): void {
    if (!this.isVibrationEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'hit') {
          navigator.vibrate(16); // 16ms Crisp Hit Pulse
        } else if (type === 'dual') {
          navigator.vibrate([22, 35, 22]); // Burst Double Vibration
        } else if (type === 'damage') {
          navigator.vibrate([45, 60, 45]); // Heavy Warning Vibration
        }
      } catch (e) {}
    }
  }

  // Realistic Web Audio Synthesized Drum Beats (Snare, Kick/Tom, Crisp Dual Bell "Ding~")
  public playSFX(type: 'perfect' | 'swish' | 'cheer' | 'error'): void {
    if (!this.isSfxEnabled) return;

    const ctx = this.initCtx();
    const now = ctx.currentTime;

    if (type === 'perfect') {
      // 🥁 PERFECT: Gentle Soft Snare Drum Snap (Gain lowered to 0.22 for smooth BGM harmony)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.10);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.10);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.10);

      // Soft Noise Snap Layer
      const bufferSize = ctx.sampleRate * 0.06;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      noiseSource.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);

    } else if (type === 'swish') {
      // 🥁 GREAT: Soft Bass Kick / Tom Hit (Gain lowered to 0.25)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);

    } else if (type === 'cheer') {
      // 🔔 DUAL STRIKE: Crisp Ultra-High Metallic "Ding~" Sound (E6 1318.5Hz ~ 2637Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(1318.5, now); // E6 High Bell Pitch
      osc2.frequency.setValueAtTime(2637.0, now); // E7 OverTone

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);

    } else if (type === 'error') {
      // ❌ DAMAGE MISS: Soft Warning Buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.20);

      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.20);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.20);
    }
  }
}

export const audioEngine = new AudioEngine();
