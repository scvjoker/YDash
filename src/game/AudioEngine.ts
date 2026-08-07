import { Note } from '../types/game';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmBuffer: AudioBuffer | null = null;
  private customAudioBuffer: AudioBuffer | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private bgmStartTime: number = 0;
  private bgmPauseOffset: number = 0;
  private isPlayingBgm: boolean = false;

  // Tutorial Phase Repeat Loop Audio Synthesizer Node
  private tutorialLoopSource: AudioBufferSourceNode | null = null;
  private currentTutorialPhase: number = 0;

  constructor() {
    // AudioContext lazily initialized on first user gesture
  }

  private initCtx(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setCustomAudioBuffer(buffer: AudioBuffer): void {
    this.customAudioBuffer = buffer;
  }

  public clearCustomAudioBuffer(): void {
    this.customAudioBuffer = null;
  }

  public async loadDefaultBGM(): Promise<AudioBuffer | null> {
    this.initCtx();
    if (this.customAudioBuffer) return this.customAudioBuffer;
    if (this.bgmBuffer) return this.bgmBuffer;

    try {
      this.bgmBuffer = this.createCyberBgmSynthBuffer();
      return this.bgmBuffer;
    } catch {
      return null;
    }
  }

  public playBGM(offset: number = 0): void {
    this.initCtx();
    if (!this.ctx) return;

    this.stopBGM();

    const activeBuf = this.customAudioBuffer || this.bgmBuffer;
    if (!activeBuf) return;

    const source = this.ctx.createBufferSource();
    source.buffer = activeBuf;
    source.loop = true;

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.65;

    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    const safeOffset = offset % activeBuf.duration;
    source.start(0, safeOffset);

    this.bgmSource = source;
    this.bgmStartTime = this.ctx.currentTime - safeOffset;
    this.bgmPauseOffset = safeOffset;
    this.isPlayingBgm = true;
  }

  public pauseBGM(): void {
    if (!this.isPlayingBgm || !this.ctx || !this.bgmSource) return;
    this.bgmPauseOffset = this.getHardwareTime();
    this.bgmSource.stop();
    this.bgmSource = null;
    this.isPlayingBgm = false;

    if (this.tutorialLoopSource) {
      try { this.tutorialLoopSource.stop(); } catch {}
      this.tutorialLoopSource = null;
    }
  }

  public stopBGM(): void {
    if (this.bgmSource) {
      try {
        this.bgmSource.stop();
      } catch {}
      this.bgmSource = null;
    }
    if (this.tutorialLoopSource) {
      try { this.tutorialLoopSource.stop(); } catch {}
      this.tutorialLoopSource = null;
    }
    this.isPlayingBgm = false;
    this.bgmPauseOffset = 0;
  }

  public getHardwareTime(): number {
    if (!this.isPlayingBgm || !this.ctx) return this.bgmPauseOffset;
    return this.ctx.currentTime - this.bgmStartTime;
  }

  // TUTORIAL PHASE REPEAT LOOP AUDIO SYNTHESIZER (每個階段可重複 4 小節樂段 Repeat)
  public playTutorialPhaseRepeatLoop(phaseIndex: number): void {
    this.initCtx();
    if (!this.ctx) return;

    this.stopBGM();
    this.currentTutorialPhase = phaseIndex;

    const loopBuf = this.createTutorialPhaseLoopBuffer(phaseIndex);
    const source = this.ctx.createBufferSource();
    source.buffer = loopBuf;
    source.loop = true; // 無縫重複循環 (Repeat)

    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.7;

    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    source.start(0);
    this.tutorialLoopSource = source;
    this.bgmStartTime = this.ctx.currentTime;
    this.isPlayingBgm = true;
  }

  public playSFX(type: 'perfect' | 'great' | 'swish' | 'cheer' | 'error'): void {
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'perfect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.exponentialRampToValueAtTime(1760, t + 0.12);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === 'great') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, t);
      osc.frequency.exponentialRampToValueAtTime(1320, t + 0.1);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'swish') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'cheer') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.setValueAtTime(659.25, t + 0.08);
      osc.frequency.setValueAtTime(783.99, t + 0.16);
      osc.frequency.setValueAtTime(1046.50, t + 0.24);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(90, t + 0.25);
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  }

  public detectBeatsFromBuffer(buffer: AudioBuffer, difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal'): Note[] {
    const rawData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    let threshold = 0.35;
    let minDistanceSec = 0.32;
    let obstacleProb = 0.20;

    if (difficulty === 'Easy') {
      threshold = 0.48;
      minDistanceSec = 0.55;
      obstacleProb = 0.12;
    } else if (difficulty === 'Hard') {
      threshold = 0.24;
      minDistanceSec = 0.22;
      obstacleProb = 0.30;
    }

    const minSamples = Math.floor(sampleRate * minDistanceSec);
    const notes: Note[] = [];
    let lastSampleIdx = -minSamples;
    const windowSize = Math.floor(sampleRate * 0.02);

    for (let i = 0; i < rawData.length - windowSize; i += windowSize) {
      let energy = 0;
      for (let j = 0; j < windowSize; j++) {
        energy += Math.abs(rawData[i + j]);
      }
      energy /= windowSize;

      if (energy > threshold && (i - lastSampleIdx) >= minSamples) {
        lastSampleIdx = i;
        const timeSec = parseFloat((i / sampleRate).toFixed(3));

        if (timeSec < 2.5) continue;

        const isObstacle = Math.random() < obstacleProb;
        const track = Math.random() > 0.5 ? 'air' : 'ground';
        const isDual = !isObstacle && Math.random() < 0.22;

        if (isObstacle) {
          notes.push({
            id: `detect_obs_${timeSec}`,
            time: timeSec,
            track,
            type: 'obstacle',
            entity: Math.random() > 0.5 ? 'hater_dog_board' : 'hater_shark'
          });
        } else {
          notes.push({
            id: `detect_note_${timeSec}`,
            time: timeSec,
            track,
            type: 'voter',
            entity: track === 'air' ? 'voter_student' : 'voter_office',
            isDual
          });
        }
      }
    }

    return notes;
  }

  // Cyber Synth BGM Generator
  private createCyberBgmSynthBuffer(): AudioBuffer {
    if (!this.ctx) this.initCtx();
    const ctx = this.ctx!;

    const sampleRate = ctx.sampleRate;
    const duration = 40.0;
    const totalSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(2, totalSamples, sampleRate);

    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    const bpm = 132;
    const secondsPerBeat = 60 / bpm;

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const currentBeat = t / secondsPerBeat;
      const beatInBar = currentBeat % 4;

      let sample = 0;

      // 1. Kick Drum
      const kickBeatTime = (currentBeat % 1) * secondsPerBeat;
      if (kickBeatTime < 0.15) {
        const kickFreq = 140 * Math.exp(-kickBeatTime * 35);
        sample += Math.sin(2 * Math.PI * kickFreq * kickBeatTime) * Math.exp(-kickBeatTime * 20) * 0.8;
      }

      // 2. Snare
      if (Math.abs(beatInBar - 1) < 0.2 || Math.abs(beatInBar - 3) < 0.2) {
        const snareTime = Math.min(Math.abs(beatInBar - 1), Math.abs(beatInBar - 3)) * secondsPerBeat;
        if (snareTime < 0.12) {
          const noise = (Math.random() * 2 - 1) * Math.exp(-snareTime * 25);
          const body = Math.sin(2 * Math.PI * 220 * snareTime) * Math.exp(-snareTime * 30);
          sample += (noise * 0.5 + body * 0.5) * 0.6;
        }
      }

      // 3. Cyber Bass Synth Line
      const bassNotes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
      const bassIdx = Math.floor(currentBeat * 2) % bassNotes.length;
      const bassFreq = bassNotes[bassIdx];
      const bassTime = (currentBeat * 2) % 1 * (secondsPerBeat / 2);
      const sawWave = (2 * ((bassFreq * bassTime) % 1) - 1);
      sample += sawWave * Math.exp(-bassTime * 6) * 0.3;

      // 4. Arpeggiator Lead
      const arpNotes = [440, 523.25, 659.25, 783.99, 880, 783.99, 659.25, 523.25];
      const arpIdx = Math.floor(currentBeat * 4) % arpNotes.length;
      const arpFreq = arpNotes[arpIdx];
      const arpTime = (currentBeat * 4) % 1 * (secondsPerBeat / 4);
      const pulseWave = Math.sin(2 * Math.PI * arpFreq * arpTime) > 0 ? 1 : -1;
      sample += pulseWave * Math.exp(-arpTime * 12) * 0.15;

      left[i] = Math.max(-1, Math.min(1, sample));
      right[i] = Math.max(-1, Math.min(1, sample));
    }

    return buffer;
  }

  // Synthesize 4-Bar Repeating Audio Loop for Tutorial Phase (120 BPM)
  private createTutorialPhaseLoopBuffer(phaseIndex: number): AudioBuffer {
    if (!this.ctx) this.initCtx();
    const ctx = this.ctx!;

    const sampleRate = ctx.sampleRate;
    const duration = 8.0; // 4 bars at 120 BPM
    const totalSamples = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(2, totalSamples, sampleRate);

    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    const bpm = 120;
    const secondsPerBeat = 60 / bpm;

    for (let i = 0; i < totalSamples; i++) {
      const t = i / sampleRate;
      const currentBeat = t / secondsPerBeat;
      let sample = 0;

      // Kick on beats 0, 1, 2, 3
      const kickBeatTime = (currentBeat % 1) * secondsPerBeat;
      if (kickBeatTime < 0.15) {
        const kickFreq = 150 * Math.exp(-kickBeatTime * 30);
        sample += Math.sin(2 * Math.PI * kickFreq * kickBeatTime) * Math.exp(-kickBeatTime * 18) * 0.75;
      }

      // Snare on beats 1 & 3
      const beatInBar = currentBeat % 4;
      if (Math.abs(beatInBar - 1) < 0.2 || Math.abs(beatInBar - 3) < 0.2) {
        const snareTime = Math.min(Math.abs(beatInBar - 1), Math.abs(beatInBar - 3)) * secondsPerBeat;
        if (snareTime < 0.12) {
          const noise = (Math.random() * 2 - 1) * Math.exp(-snareTime * 25);
          sample += noise * 0.5;
        }
      }

      // Distinct Phase Synth Melody per Tutorial Step
      let freq = 440;
      if (phaseIndex === 1) freq = 523.25; // C5 Air
      else if (phaseIndex === 2) freq = 349.23; // F4 Ground
      else if (phaseIndex === 3) freq = 659.25; // E5 Dual
      else if (phaseIndex === 4) freq = 293.66; // D4 Dodge
      else if (phaseIndex === 5) freq = 880; // A5 Fever

      const noteTime = (currentBeat % 0.5) * (secondsPerBeat / 2);
      const synthSample = Math.sin(2 * Math.PI * freq * noteTime) * Math.exp(-noteTime * 10) * 0.25;
      sample += synthSample;

      left[i] = Math.max(-1, Math.min(1, sample));
      right[i] = Math.max(-1, Math.min(1, sample));
    }

    return buffer;
  }
}

export const audioEngine = new AudioEngine();
