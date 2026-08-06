import { Note, TrackType, EntityType } from '../types/game';

export class AudioEngine {
  private ctx: AudioContext;
  private bgmBuffer: AudioBuffer | null = null;
  private customAudioBuffer: AudioBuffer | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private bgmStartTime: number = 0;
  private bgmPauseOffset: number = 0;
  private isBgmPlaying: boolean = false;

  constructor() {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
  }

  public getHardwareTime(): number {
    if (!this.isBgmPlaying) return this.bgmPauseOffset;
    return this.ctx.currentTime - this.bgmStartTime;
  }

  public setCustomAudioBuffer(buffer: AudioBuffer | null): void {
    this.customAudioBuffer = buffer;
  }

  public clearCustomAudioBuffer(): void {
    this.customAudioBuffer = null;
  }

  public async loadDefaultBGM(): Promise<AudioBuffer | null> {
    if (this.customAudioBuffer) {
      return this.customAudioBuffer;
    }

    if (this.bgmBuffer) return this.bgmBuffer;

    const candidateUrls = [
      '/theme_song.mp3',
      '/theme_song.wav',
      '/theme_song.ogg',
      '/assets/theme_song.mp3'
    ];

    for (const url of candidateUrls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          this.bgmBuffer = await this.ctx.decodeAudioData(arrayBuffer);
          return this.bgmBuffer;
        }
      } catch {
        // Try next format candidate
      }
    }

    // Fallback: Synthesize an upbeat electro BGM if no file exists
    this.bgmBuffer = this.synthesizeElectroBGM();
    return this.bgmBuffer;
  }

  public playBGM(offset: number = 0): void {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const activeBuffer = this.customAudioBuffer || this.bgmBuffer;
    if (!activeBuffer) return;

    this.stopBGM();

    this.bgmSource = this.ctx.createBufferSource();
    this.bgmSource.buffer = activeBuffer;
    this.bgmSource.connect(this.ctx.destination);

    this.bgmPauseOffset = offset;
    this.bgmStartTime = this.ctx.currentTime - offset;
    this.bgmSource.start(0, offset);
    this.isBgmPlaying = true;
  }

  public pauseBGM(): void {
    if (!this.isBgmPlaying || !this.bgmSource) return;
    this.bgmPauseOffset = this.ctx.currentTime - this.bgmStartTime;
    this.bgmSource.stop();
    this.bgmSource = null;
    this.isBgmPlaying = false;
  }

  public stopBGM(): void {
    if (this.bgmSource) {
      try {
        this.bgmSource.stop();
      } catch {
        // Ignore if stopped
      }
      this.bgmSource = null;
    }
    this.isBgmPlaying = false;
    this.bgmPauseOffset = 0;
  }

  public detectBeatsFromBuffer(
    buffer: AudioBuffer,
    difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal'
  ): Note[] {
    const rawData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    const windowSize = Math.floor(sampleRate * 0.05); // 50ms window
    const energy: number[] = [];

    for (let i = 0; i < rawData.length; i += windowSize) {
      let sum = 0;
      for (let j = 0; j < windowSize && (i + j) < rawData.length; j++) {
        sum += rawData[i + j] * rawData[i + j];
      }
      energy.push(Math.sqrt(sum / windowSize));
    }

    // Dynamic threshold according to difficulty
    let thresholdMult = 1.35;
    let minInterval = 0.55;

    if (difficulty === 'Easy') {
      thresholdMult = 1.6;
      minInterval = 0.75;
    } else if (difficulty === 'Hard') {
      thresholdMult = 1.15;
      minInterval = 0.38;
    }

    const avgEnergy = energy.reduce((a, b) => a + b, 0) / energy.length;
    const threshold = avgEnergy * thresholdMult;

    const notes: Note[] = [];
    let lastTime = 5.0; // Guaranteed 5.0s lead-in buffer delay at start
    let lastObstacleTime = -5.0;

    for (let i = 0; i < energy.length; i++) {
      const currentTime = (i * windowSize) / sampleRate;
      if (currentTime < 5.0) continue;

      if (energy[i] > threshold && (currentTime - lastTime) >= minInterval) {
        lastTime = currentTime;

        // Guarantee Haters are spaced at least 2.2s apart
        const canSpawnObstacle = (currentTime - lastObstacleTime) >= 2.2;
        const isObstacle = canSpawnObstacle && Math.random() < 0.22;
        const isAir = Math.random() > 0.5;
        const track: TrackType = isAir ? 'air' : 'ground';

        if (isObstacle) {
          lastObstacleTime = currentTime;
          const obstacleEntity: EntityType = isAir ? 'hater_shark_rose' : 'hater_dog_board';
          notes.push({
            id: `note_${i}`,
            time: Number(currentTime.toFixed(2)),
            track,
            type: 'obstacle',
            entity: obstacleEntity
          });
        } else {
          const isDual = Math.random() < 0.18;
          const voterEntity: EntityType = isAir ? 'voter_student' : 'voter_office';

          if (isDual) {
            notes.push({
              id: `note_${i}_air`,
              time: Number(currentTime.toFixed(2)),
              track: 'air',
              type: 'voter',
              entity: 'voter_student',
              isDual: true
            });
            notes.push({
              id: `note_${i}_gnd`,
              time: Number(currentTime.toFixed(2)),
              track: 'ground',
              type: 'voter',
              entity: 'voter_office',
              isDual: true
            });
          } else {
            notes.push({
              id: `note_${i}`,
              time: Number(currentTime.toFixed(2)),
              track,
              type: 'voter',
              entity: voterEntity
            });
          }
        }
      }
    }

    return notes;
  }

  public playSFX(type: 'perfect' | 'swish' | 'error' | 'cheer'): void {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'perfect') {
      // Acoustic Snare SFX
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'swish') {
      // Bass Kick SFX
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'error') {
      // Rim Break Error SFX
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.15);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'cheer') {
      // Crash Cymbal SFX
      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  private synthesizeElectroBGM(): AudioBuffer {
    const sr = this.ctx.sampleRate;
    const duration = 40;
    const buffer = this.ctx.createBuffer(2, sr * duration, sr);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    const bpm = 135;
    const secondsPerBeat = 60 / bpm;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sr;
      if (t < 5.0) {
        left[i] = 0;
        right[i] = 0;
        continue;
      }

      const beat = (t - 5.0) / secondsPerBeat;
      const subBeat = beat % 1;

      let kick = 0;
      if (subBeat < 0.15) {
        const kickFreq = 140 * Math.exp(-subBeat * 25);
        kick = Math.sin(2 * Math.PI * kickFreq * subBeat) * (1 - subBeat / 0.15) * 0.7;
      }

      let bass = 0;
      const bassNote = (Math.floor(beat) % 4 === 0) ? 55 : (Math.floor(beat) % 4 === 2) ? 65 : 49;
      bass = Math.sin(2 * Math.PI * bassNote * t) * 0.2;

      let synth = 0;
      if (beat % 2 >= 0.5 && beat % 2 < 1.5) {
        const leadFreq = 440 + Math.sin(t * 8) * 110;
        synth = (Math.sin(2 * Math.PI * leadFreq * t) > 0 ? 0.15 : -0.15) * (1 - (subBeat % 0.5));
      }

      const master = (kick + bass + synth) * 0.45;
      left[i] = master;
      right[i] = master;
    }

    return buffer;
  }
}

export const audioEngine = new AudioEngine();
