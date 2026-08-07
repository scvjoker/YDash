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

    let minEnergyThreshold = 0.18;
    let minTimeGap = 0.28;

    if (difficulty === 'Easy') {
      minEnergyThreshold = 0.28;
      minTimeGap = 0.45;
    } else if (difficulty === 'Hard') {
      minEnergyThreshold = 0.12;
      minTimeGap = 0.20;
    }

    const notes: any[] = [];
    let lastNoteTime = -1;

    for (let i = 2; i < energyList.length - 2; i++) {
      const prev = energyList[i - 1].energy;
      const currItem = energyList[i];
      const curr = currItem.energy;
      const next = energyList[i + 1].energy;

      if (curr > minEnergyThreshold && curr > prev && curr > next) {
        if (currItem.time - lastNoteTime >= minTimeGap && currItem.time >= 5.0) {
          const track = currItem.isBass ? 'ground' : 'air';
          const isDual = Math.random() < (difficulty === 'Hard' ? 0.22 : 0.12);
          const isObstacle = Math.random() < (difficulty === 'Hard' ? 0.18 : 0.10);

          if (isObstacle) {
            notes.push({
              time: currItem.time,
              track,
              type: 'obstacle',
              entity: Math.random() > 0.5 ? 'hater_dog_board' : 'hater_shark'
            });
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
          } else {
            notes.push({
              time: currItem.time,
              track,
              type: 'normal',
              entity: 'tissue_pack'
            });
          }

          lastNoteTime = currItem.time;
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
          navigator.vibrate(14); // Crisp 14ms Hit Pulse
        } else if (type === 'dual') {
          navigator.vibrate([20, 25, 20]); // Light Double Vibration
        } else if (type === 'damage') {
          navigator.vibrate([40, 50, 40]); // Warning Vibration
        }
      } catch (e) {}
    }
  }

  // Realistic Web Audio Synthesized Drum Beats (Gentle Volume & Clean Chime Dual Sound)
  public playSFX(type: 'perfect' | 'swish' | 'cheer' | 'error'): void {
    if (!this.isSfxEnabled) return;

    const ctx = this.initCtx();
    const now = ctx.currentTime;

    if (type === 'perfect') {
      // 🥁 PERFECT: Gentle Acoustic Snare Drum Snap (Reduced Volume: 0.22)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.10);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.10);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.10);

      // Add Subtle Soft Noise Snap
      const bufferSize = ctx.sampleRate * 0.05;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.08, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.05);

      noiseSource.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);

    } else if (type === 'swish') {
      // 🥁 GREAT: Soft Bass Drum Hit (Reduced Volume: 0.25)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);

    } else if (type === 'cheer') {
      // 🔔 DUAL STRIKE: Simple Clean High Bell Chime ("叮~")
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1318.5, now); // E6 High Pitch Bell
      osc.frequency.exponentialRampToValueAtTime(2637.0, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);

    } else if (type === 'error') {
      // ❌ DAMAGE MISS: Soft Error Buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.20);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.20);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.20);
    }
  }
}

export const audioEngine = new AudioEngine();
