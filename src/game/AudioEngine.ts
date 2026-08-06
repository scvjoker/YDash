import { Note, NoteType, TrackType, EntityType } from '../types/game';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmBuffer: AudioBuffer | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private startTime: number = 0;
  private pauseOffset: number = 0;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;

  private sfxBuffers: Map<string, AudioBuffer> = new Map();

  constructor() {}

  public initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.generateDrumKitSFX();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getHardwareTime(): number {
    if (!this.ctx) return 0;
    if (!this.isPlaying) return this.pauseOffset;
    return this.ctx.currentTime - this.startTime;
  }

  public async loadAudioFile(file: File): Promise<AudioBuffer> {
    const ctx = this.initContext();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    this.bgmBuffer = audioBuffer;
    return audioBuffer;
  }

  public async loadAudioFromUrl(url: string): Promise<AudioBuffer | null> {
    try {
      const ctx = this.initContext();
      const response = await fetch(url);
      if (!response.ok) return null;
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      this.bgmBuffer = audioBuffer;
      return audioBuffer;
    } catch {
      return null;
    }
  }

  public async loadDefaultBGM(): Promise<AudioBuffer> {
    const ctx = this.initContext();

    const customUrls = ['/theme_song.mp3', '/theme_song.wav', '/theme_song.ogg'];
    for (const url of customUrls) {
      const buffer = await this.loadAudioFromUrl(url);
      if (buffer) {
        this.bgmBuffer = buffer;
        return buffer;
      }
    }

    const sampleRate = ctx.sampleRate;
    const duration = 60;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);

    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    const bpm = 135;
    const beatSec = 60 / bpm;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      
      const beatProgress = (t % beatSec) / beatSec;
      const kickEnv = Math.max(0, 1 - beatProgress * 8);
      const kickFreq = 120 * Math.exp(-beatProgress * 20) + 40;
      const kick = Math.sin(2 * Math.PI * kickFreq * t) * kickEnv * 0.5;

      const noteStep = Math.floor((t / (beatSec / 4)) % 16);
      const freqs = [110, 110, 130.81, 110, 146.83, 110, 130.81, 164.81];
      const bassFreq = freqs[noteStep % freqs.length];
      const bassEnv = Math.max(0, 1 - ((t % (beatSec / 4)) / (beatSec / 4)) * 3);
      const bass = (Math.sin(2 * Math.PI * bassFreq * t) > 0 ? 0.3 : -0.3) * bassEnv * 0.2;

      const beatIndex = Math.floor(t / beatSec) % 4;
      const isSnareBeat = beatIndex === 1 || beatIndex === 3;
      let snare = 0;
      if (isSnareBeat) {
        const snareEnv = Math.max(0, 1 - beatProgress * 6);
        const noise = (Math.random() * 2 - 1) * snareEnv * 0.25;
        const snareTone = Math.sin(2 * Math.PI * 220 * t) * snareEnv * 0.15;
        snare = noise + snareTone;
      }

      const synthEnv = Math.max(0, 1 - ((t % (beatSec / 2)) / (beatSec / 2)) * 2);
      const melodyNotes = [440, 523.25, 659.25, 587.33, 659.25, 783.99, 659.25, 523.25];
      const melodyFreq = melodyNotes[Math.floor(t / beatSec) % melodyNotes.length];
      const synth = Math.sin(2 * Math.PI * melodyFreq * t) * synthEnv * 0.15;

      left[i] = kick + bass + snare + synth;
      right[i] = kick + bass + snare + synth;
    }

    this.bgmBuffer = buffer;
    return buffer;
  }

  public playBGM(offset: number = 0): void {
    if (!this.bgmBuffer) return;
    const ctx = this.initContext();

    this.stopBGM();

    const source = ctx.createBufferSource();
    source.buffer = this.bgmBuffer;
    source.connect(ctx.destination);

    this.startTime = ctx.currentTime - offset;
    this.pauseOffset = offset;
    source.start(0, offset);

    this.bgmSource = source;
    this.isPlaying = true;
  }

  public stopBGM(): void {
    if (this.bgmSource) {
      try {
        this.bgmSource.stop();
        this.bgmSource.disconnect();
      } catch {}
      this.bgmSource = null;
    }
    this.isPlaying = false;
  }

  public pauseBGM(): void {
    if (this.isPlaying) {
      this.pauseOffset = this.getHardwareTime();
      this.stopBGM();
    }
  }

  private generateDrumKitSFX(): void {
    if (!this.ctx) return;
    const sr = this.ctx.sampleRate;

    // 1. Perfect Hit: Snare Punch
    const snareLen = Math.floor(sr * 0.18);
    const snareBuf = this.ctx.createBuffer(1, snareLen, sr);
    const snareData = snareBuf.getChannelData(0);
    for (let i = 0; i < snareLen; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 22);
      const tone = Math.sin(2 * Math.PI * 180 * t) * 0.4;
      const snap = Math.sin(2 * Math.PI * 340 * t) * 0.3;
      const noise = (Math.random() * 2 - 1) * 0.5;
      snareData[i] = (tone + snap + noise) * env * 0.6;
    }
    this.sfxBuffers.set('perfect', snareBuf);

    // 2. Great / Swish: Kick Punch
    const kickLen = Math.floor(sr * 0.15);
    const kickBuf = this.ctx.createBuffer(1, kickLen, sr);
    const kickData = kickBuf.getChannelData(0);
    for (let i = 0; i < kickLen; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 28);
      const freq = 130 * Math.exp(-t * 30) + 45;
      kickData[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.7;
    }
    this.sfxBuffers.set('swish', kickBuf);

    // 3. Error Hit: Muffled Rim Break
    const errLen = Math.floor(sr * 0.15);
    const errBuf = this.ctx.createBuffer(1, errLen, sr);
    const errData = errBuf.getChannelData(0);
    for (let i = 0; i < errLen; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 18);
      errData[i] = (Math.random() * 2 - 1) * env * 0.35;
    }
    this.sfxBuffers.set('error', errBuf);

    // 4. Cheer / Dual Strike / Fever: High Crash
    const crashLen = Math.floor(sr * 0.4);
    const crashBuf = this.ctx.createBuffer(1, crashLen, sr);
    const crashData = crashBuf.getChannelData(0);
    for (let i = 0; i < crashLen; i++) {
      const t = i / sr;
      const env = Math.exp(-t * 6);
      crashData[i] = (Math.random() * 2 - 1) * env * 0.4;
    }
    this.sfxBuffers.set('cheer', crashBuf);
  }

  public playSFX(name: 'swish' | 'perfect' | 'error' | 'cheer'): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    const buf = this.sfxBuffers.get(name);
    if (!buf) return;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
  }

  // Advanced Spectrum Detection with 5s Lead-In Buffer & Special Note Types (Dual Strike, Rapid Mash, Obstacles)
  public detectBeatsFromBuffer(
    buffer: AudioBuffer,
    difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal'
  ): Note[] {
    const rawData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;
    const windowSize = Math.floor(sampleRate * 0.04);
    const notes: Note[] = [];

    // 5-second Lead-In Preparation Delay
    const leadInDelay = 5.0;

    let minDistance = 0.42; // Easy
    let threshold = 0.22;

    if (difficulty === 'Normal') {
      minDistance = 0.28;
      threshold = 0.16;
    } else if (difficulty === 'Hard') {
      minDistance = 0.18;
      threshold = 0.11;
    }

    let lastTime = 0;
    let stepCount = 0;

    for (let i = 0; i < rawData.length; i += windowSize) {
      let energy = 0;
      for (let j = 0; j < windowSize && (i + j) < rawData.length; j++) {
        energy += rawData[i + j] * rawData[i + j];
      }
      energy = Math.sqrt(energy / windowSize);

      const time = leadInDelay + (i / sampleRate);
      if (energy > threshold && (time - lastTime) >= minDistance) {
        stepCount++;

        let track: TrackType = (stepCount % 2 === 0) ? 'ground' : 'air';
        let type: NoteType = 'voter';
        let entity: EntityType = track === 'air' ? 'voter_cloud' : 'voter_office';

        // 1. Feature: Dual Strike (上下軌同時按下) every 7th beat
        if (stepCount % 7 === 0) {
          const dualTime = parseFloat(time.toFixed(2));
          notes.push({
            id: `dual_air_${stepCount}`,
            time: dualTime,
            track: 'air',
            type: 'voter',
            entity: 'voter_cloud',
            isDual: true
          });
          notes.push({
            id: `dual_ground_${stepCount}`,
            time: dualTime,
            track: 'ground',
            type: 'voter',
            entity: 'voter_office',
            isDual: true
          });
          lastTime = time;
          continue;
        }

        // 2. Feature: Rapid Mash (連打音符) every 11th beat
        if (stepCount % 11 === 0) {
          type = 'rapid_mash';
          entity = 'tissue_bonus';
        } 
        // 3. Feature: Obstacles (黑粉與鯊魚障礙物)
        else if (stepCount % 5 === 0) {
          track = 'ground';
          type = 'obstacle';
          entity = 'hater_dog_board';
        } else if (stepCount % 8 === 0) {
          track = 'air';
          type = 'obstacle';
          entity = 'hater_shark_rose';
        }

        notes.push({
          id: `note_${stepCount}`,
          time: parseFloat(time.toFixed(2)),
          track,
          type,
          entity,
          isMash: type === 'rapid_mash'
        });

        lastTime = time;
      }
    }

    return notes;
  }
}

export const audioEngine = new AudioEngine();
