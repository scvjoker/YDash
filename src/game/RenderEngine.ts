import { Note, CostumeId } from '../types/game';

export interface HitParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size?: number;
  text?: string;
  isWink?: boolean;
  type?: 'perfect' | 'great' | 'dodge' | 'damage' | 'dual_strike';
}

export class RenderEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: HitParticle[] = [];

  // Assets Images & MP4 Background Support
  private bgImage: HTMLImageElement | null = null;
  private defaultBgImage: HTMLImageElement | null = null;
  private bgVideoElement: HTMLVideoElement | null = null;

  private yoakaMainImage: HTMLImageElement | null = null;
  private yoakaDefaultImage: HTMLImageElement | null = null;
  private yoakaOfficeImage: HTMLImageElement | null = null;
  private yoakaKpopImage: HTMLImageElement | null = null;

  private voterOfficeImage: HTMLImageElement | null = null;
  private voterStudentImage: HTMLImageElement | null = null;
  private haterDogImage: HTMLImageElement | null = null;
  private haterSharkImage: HTMLImageElement | null = null;
  private tissuePackImage: HTMLImageElement | null = null;

  private yoakaCurrentY: number = 0;
  private yoakaTrailHistory: { y: number; alpha: number; scale: number }[] = [];
  private damageFlashAlpha: number = 0;
  private goldFlashAlpha: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.loadAssets();
  }

  private loadAssets(): void {
    this.defaultBgImage = this.loadSmartImage(['/cyber_runway_bg.png', '/cyber_runway_bg.jpg', '/cyber_runway_bg.jpeg', '/cyber_runway_bg.webp']);
    this.bgImage = this.defaultBgImage;

    this.yoakaMainImage = this.loadSmartImage(['/yoaka_main.png', '/yoaka_main.jpg', '/yoaka_main.jpeg', '/yoaka_main.webp']);

    // 3 Costume Images Dedicated Loader
    this.yoakaDefaultImage = this.loadSmartImage(['/assets/yoaka_default.png', '/assets/yoaka_default.jpg', '/assets/yoaka_default.jpeg', '/assets/yoaka_default.webp', '/yoaka_main.jpg']);
    this.yoakaOfficeImage = this.loadSmartImage(['/assets/yoaka_office.png', '/assets/yoaka_office.jpg', '/assets/yoaka_office.jpeg', '/assets/yoaka_office.webp', '/yoaka_office.png', '/yoaka_office.jpg', '/yoaka_main.jpg']);
    this.yoakaKpopImage = this.loadSmartImage(['/assets/yoaka_kpop.png', '/assets/yoaka_kpop.jpg', '/assets/yoaka_kpop.jpeg', '/assets/yoaka_kpop.webp', '/yoaka_kpop.png', '/yoaka_kpop.jpg', '/yoaka_main.jpg']);

    this.voterOfficeImage = this.loadSmartImage(['/assets/voter_office.png', '/assets/voter_office.jpg', '/assets/voter_office.jpeg', '/assets/voter_office.webp']);
    this.voterStudentImage = this.loadSmartImage(['/assets/voter_student.png', '/assets/voter_student.jpg', '/assets/voter_student.jpeg', '/assets/voter_student.webp']);
    this.haterDogImage = this.loadSmartImage(['/assets/hater_dog_board.png', '/assets/hater_dog_board.jpg', '/assets/hater_dog_board.jpeg', '/assets/hater_dog_board.webp']);
    this.haterSharkImage = this.loadSmartImage(['/assets/hater_shark.png', '/assets/hater_shark.jpg', '/assets/hater_shark.jpeg', '/assets/hater_shark.webp']);
    this.tissuePackImage = this.loadSmartImage(['/assets/tissue_pack.png', '/assets/tissue_pack.jpg', '/assets/tissue_pack.jpeg', '/assets/tissue_pack.webp', '/assets/tissue_target.png', '/assets/tissue_target.jpg']);
  }

  public setSongBgImage(bgUrl?: string): void {
    // Stop any active video background
    if (this.bgVideoElement) {
      this.bgVideoElement.pause();
      this.bgVideoElement = null;
    }

    if (!bgUrl) {
      this.bgImage = this.defaultBgImage;
      return;
    }

    // Check if background is an MP4/WebM Video
    if (bgUrl.endsWith('.mp4') || bgUrl.endsWith('.webm')) {
      const video = document.createElement('video');
      video.src = bgUrl;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.play().catch(() => {});
      this.bgVideoElement = video;
      this.bgImage = null;
      return;
    }

    // Otherwise load standard image background
    const customBg = this.loadSmartImage([bgUrl, '/cyber_runway_bg.png', '/cyber_runway_bg.jpg']);
    this.bgImage = customBg;
  }

  private loadSmartImage(candidateUrls: string[]): HTMLImageElement {
    const img = new Image();

    let currentIndex = 0;
    const tryNext = () => {
      if (currentIndex < candidateUrls.length) {
        const url = candidateUrls[currentIndex++];
        img.src = url;
      }
    };

    img.onerror = () => {
      tryNext();
    };

    tryNext();
    return img;
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public triggerDamageEffect(): void {
    this.damageFlashAlpha = 0.65;
  }

  public triggerGoldFlashEffect(): void {
    this.goldFlashAlpha = 0.65;
  }

  public render(
    currentTime: number,
    notes: Note[],
    costume: CostumeId,
    stats: { supportRate: number; isFeverActive: boolean; combo: number },
    inputState: { airActive: boolean; groundActive: boolean },
    activeTrack: 'air' | 'ground' = 'ground',
    speedMultiplier: number = 1.0
  ): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const ctx = this.ctx;

    // Responsive Scale Factor for Desktop & Mobile (Baseline Height = 640px)
    const scale = Math.min(1.8, Math.max(0.60, height / 640));

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Seamless Parallax Background (Supports MP4 Video & Images with Multi-Tile Loop)
    this.drawBackground(ctx, width, height, currentTime, stats.isFeverActive);

    // Dynamic Responsive Positions
    const airY = height * 0.36;
    const groundY = height * 0.70;
    const hitX = Math.max(160 * scale, width * 0.22);
    const noteSpeed = width * 0.45 * speedMultiplier;

    // Smooth Yoaka Track Switch Animation & Extended Trail Tracking
    const targetYoakaY = activeTrack === 'air' ? airY : groundY;
    if (this.yoakaCurrentY === 0) {
      this.yoakaCurrentY = groundY;
    }

    const moveDiffY = targetYoakaY - this.yoakaCurrentY;
    if (Math.abs(moveDiffY) > 1.5) {
      this.yoakaTrailHistory.unshift({ y: this.yoakaCurrentY, alpha: 0.85, scale: 1.0 });
      if (this.yoakaTrailHistory.length > 14) {
        this.yoakaTrailHistory.pop();
      }
    }
    this.yoakaCurrentY += moveDiffY * 0.22;

    this.yoakaTrailHistory.forEach((trail, idx) => {
      trail.alpha -= 0.045;
      trail.scale = Math.max(0.6, 1.0 - idx * 0.03);
    });
    this.yoakaTrailHistory = this.yoakaTrailHistory.filter(t => t.alpha > 0);

    // 2. Draw Dual Tracks
    this.drawTracks(ctx, width, height, airY, groundY, currentTime, stats.isFeverActive, scale);

    // 3. Draw Clean Target Hit Zones
    this.drawHitZone(ctx, hitX, airY, inputState.airActive, '#00f0ff', scale);
    this.drawHitZone(ctx, hitX, groundY, inputState.groundActive, '#ff007f', scale);

    // Dual Press: Golden Beam Connection Line
    if (inputState.airActive && inputState.groundActive) {
      this.drawGoldenLaserBeam(ctx, hitX, airY, groundY, scale);
    }

    // 4. Draw Active Notes & Dual Beams
    const activeDualNotes: { [time: number]: { airX?: number; groundX?: number } } = {};

    for (const note of notes) {
      if (note.hit) continue;
      const timeDiff = note.time - currentTime;
      const noteX = hitX + timeDiff * noteSpeed;

      if (noteX >= -180 && noteX <= width + 380) {
        const noteY = note.track === 'air' ? airY : groundY;

        if (note.isDual) {
          if (!activeDualNotes[note.time]) activeDualNotes[note.time] = {};
          if (note.track === 'air') activeDualNotes[note.time].airX = noteX;
          if (note.track === 'ground') activeDualNotes[note.time].groundX = noteX;
        }

        this.drawCleanVectorNote(ctx, note, noteX, noteY, currentTime, scale);
      }
    }

    // Draw Golden Dual Beams for Dual Notes
    Object.values(activeDualNotes).forEach(dual => {
      if (dual.airX !== undefined && dual.groundX !== undefined) {
        this.drawGoldenLaserBeam(ctx, dual.airX, airY, groundY, scale);
      }
    });

    // 5. Draw Borderless Hero Side Standee with Breathing Pulse
    const sideCardX = Math.max(80 * scale, hitX - 175 * scale);
    this.drawHeroSideCard2X(ctx, sideCardX, this.yoakaCurrentY, costume, currentTime, activeTrack, scale);

    // 6. Draw Hero Runner Stage
    this.drawYoaka(ctx, hitX, this.yoakaCurrentY, costume, currentTime, inputState.airActive || inputState.groundActive, stats.isFeverActive, activeTrack, scale);

    // 7. Screen Flash Overlays
    if (this.damageFlashAlpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 0, 85, ${this.damageFlashAlpha})`;
      ctx.fillRect(0, 0, width, height);
      this.damageFlashAlpha -= 0.03;
      ctx.restore();
    }

    if (this.goldFlashAlpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 230, 0, ${this.goldFlashAlpha})`;
      ctx.fillRect(0, 0, width, height);
      this.goldFlashAlpha -= 0.04;
      ctx.restore();
    }

    // 8. Start & Unpause Buffer Countdown Text (Center at height * 0.24)
    if (currentTime < 4.8) {
      const countdown = Math.ceil(5.0 - currentTime);
      ctx.save();
      ctx.font = `900 ${Math.floor(34 * scale)}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#ffe600';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 20 * scale;
      ctx.fillText(`⚡ 準備拜票！音符將在 ${countdown} 秒後抵達 ⚡`, width / 2, height * 0.24);
      ctx.restore();
    }

    // 9. DRAW COMBO COUNT AT SAME Y-ROW (height * 0.24), RIGHT-ALIGNED (width * 0.88)!
    if (stats.combo > 1) {
      ctx.save();
      ctx.textAlign = 'right';

      ctx.font = `italic 900 ${Math.floor(48 * scale)}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#ffe600';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 22 * scale;
      ctx.fillText(`${stats.combo}`, width * 0.88 - Math.floor(65 * scale), height * 0.24);

      ctx.font = `900 ${Math.floor(18 * scale)}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15 * scale;
      ctx.fillText(`COMBO`, width * 0.88, height * 0.24);

      ctx.restore();
    }

    // 10. Draw Fever Effects
    if (stats.isFeverActive) {
      this.drawFeverEffects(ctx, width, height, currentTime, scale);
    }

    // 11. Update & Draw Particles & Shockwaves
    this.updateAndDrawParticles(ctx, scale);
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    isFever: boolean
  ): void {
    // A. Priority 1: MP4 Dynamic Video Background (Muted Loop)
    if (this.bgVideoElement && this.bgVideoElement.readyState >= 2) {
      const vidW = this.bgVideoElement.videoWidth || 1920;
      const vidH = this.bgVideoElement.videoHeight || 1080;
      const bgW = Math.max(10, vidW * (height / vidH));
      const speed = 85;
      const scrollX = (time * speed) % bgW;

      let currentX = -scrollX;
      while (currentX < width) {
        ctx.drawImage(this.bgVideoElement, currentX, 0, bgW + 1.5, height);
        currentX += bgW;
      }

      ctx.fillStyle = isFever ? 'rgba(40, 0, 60, 0.4)' : 'rgba(5, 6, 18, 0.55)';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // B. Priority 2: Custom / Default Image Background
    const activeBg = (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth !== 0)
      ? this.bgImage
      : (this.defaultBgImage && this.defaultBgImage.complete && this.defaultBgImage.naturalWidth !== 0)
      ? this.defaultBgImage
      : null;

    if (activeBg) {
      const speed = 85;
      const naturalW = activeBg.naturalWidth || activeBg.width;
      const naturalH = activeBg.naturalHeight || activeBg.height;

      // Aspect-ratio scaled background width
      const bgW = Math.max(10, naturalW * (height / naturalH));
      
      // Continuous modulo offset
      const scrollX = (time * speed) % bgW;

      // Tile images dynamically until full screen width + buffer is filled (100% Seamless Loop!)
      let currentX = -scrollX;
      while (currentX < width) {
        ctx.drawImage(activeBg, currentX, 0, bgW + 1.5, height);
        currentX += bgW;
      }

      ctx.fillStyle = isFever ? 'rgba(40, 0, 60, 0.4)' : 'rgba(5, 6, 18, 0.55)';
      ctx.fillRect(0, 0, width, height);
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090a16');
      bgGrad.addColorStop(1, '#12142d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.save();
    ctx.strokeStyle = isFever ? 'rgba(255, 0, 127, 0.3)' : 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;
    const gridOffset = (time * 150) % 40;
    ctx.beginPath();
    for (let x = -gridOffset; x < width; x += 40) {
      ctx.moveTo(x, height * 0.75);
      ctx.lineTo(x - 100, height);
    }
    ctx.stroke();
    ctx.restore();
  }

  private drawTracks(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    airY: number,
    groundY: number,
    time: number,
    isFever: boolean,
    scale: number
  ): void {
    ctx.save();
    
    ctx.strokeStyle = isFever ? '#ff007f' : '#00f0ff';
    ctx.lineWidth = Math.max(2.5, 4.5 * scale);
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 14 * scale;
    ctx.beginPath();
    ctx.moveTo(0, airY);
    ctx.lineTo(width, airY);
    ctx.stroke();

    ctx.strokeStyle = isFever ? '#ffe600' : '#ff007f';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    ctx.restore();
  }

  private drawHitZone(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isActive: boolean,
    color: string,
    scale: number
  ): void {
    ctx.save();
    ctx.translate(x, y);

    const radius = (isActive ? 52 : 42) * scale;
    ctx.strokeStyle = color;
    ctx.lineWidth = (isActive ? 6 : 4) * scale;
    ctx.shadowColor = color;
    ctx.shadowBlur = (isActive ? 30 : 15) * scale;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isActive ? color : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawGoldenLaserBeam(
    ctx: CanvasRenderingContext2D,
    x: number,
    airY: number,
    groundY: number,
    scale: number
  ): void {
    ctx.save();

    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 10 * scale;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 35 * scale;

    ctx.beginPath();
    ctx.moveTo(x, airY);
    ctx.lineTo(x, groundY);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4 * scale;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(x, airY);
    ctx.lineTo(x, groundY);
    ctx.stroke();

    ctx.restore();
  }

  private drawHeroSideCard2X(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    costume: CostumeId,
    time: number,
    activeTrack: 'air' | 'ground',
    scale: number
  ): void {
    ctx.save();
    ctx.translate(x, y);

    const breathScale = 1.0 + Math.sin(time * 3.5) * 0.04;
    const baseW = 240 * scale;
    const baseH = 240 * scale;
    const cardW = baseW * breathScale;
    const cardH = baseH * breathScale;

    let accentColor = activeTrack === 'air' ? '#00f0ff' : '#ff007f';
    let costumeName = '競選 Yoaka';
    let targetImg = this.yoakaDefaultImage || this.yoakaMainImage;

    if (costume === 'office_glasses') {
      accentColor = '#ffe600';
      costumeName = '學霸 Yoaka';
      targetImg = this.yoakaOfficeImage || this.yoakaMainImage;
    } else if (costume === 'kpop_idol') {
      accentColor = '#ff007f';
      costumeName = '偶像 Yoaka';
      targetImg = this.yoakaKpopImage || this.yoakaMainImage;
    }

    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 35 * scale;

    if (targetImg && targetImg.complete && targetImg.naturalWidth !== 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 18 * scale);
      ctx.clip();
      ctx.drawImage(targetImg, -cardW / 2, -cardH / 2, cardW, cardH);
      ctx.restore();
    }

    ctx.font = `900 ${Math.floor(14 * scale)}px "Chakra Petch", sans-serif`;
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 15 * scale;
    ctx.fillText(costumeName, 0, cardH / 2 + 18 * scale);

    ctx.restore();
  }

  private drawCleanVectorNote(
    ctx: CanvasRenderingContext2D,
    note: Note,
    x: number,
    y: number,
    time: number,
    scale: number
  ): void {
    ctx.save();
    ctx.translate(x, y);

    const bounce = Math.sin(time * 14) * 4 * scale;
    const isObstacle = note.type === 'obstacle' || note.entity.startsWith('hater');

    if (isObstacle) {
      const size = 320 * scale;
      const targetHaterImg = note.entity === 'hater_dog_board' ? this.haterDogImage : this.haterSharkImage;

      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 80 * scale;

      if (targetHaterImg && targetHaterImg.complete && targetHaterImg.naturalWidth !== 0) {
        ctx.drawImage(targetHaterImg, -size / 2, bounce - size / 2, size, size);
      } else {
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(0, bounce, size / 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = `900 ${Math.floor(16 * scale)}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#ff0055';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 20 * scale;
      ctx.fillText('⚠️ DODGE 閃避!', 0, bounce + size / 2 + 16 * scale);

    } else {
      const isAir = note.track === 'air';
      const mainColor = note.isDual ? '#ffe600' : isAir ? '#00f0ff' : '#ff007f';
      const radius = 35 * scale;

      ctx.fillStyle = mainColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5 * scale;
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = 18 * scale;

      ctx.beginPath();
      ctx.arc(0, bounce, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, bounce, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = `900 ${Math.floor(11 * scale)}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = mainColor;
      ctx.textAlign = 'center';
      ctx.fillText(note.isDual ? '⚡ DUAL' : isAir ? 'AIR VOTER' : 'GND VOTER', 0, bounce + 42 * scale);
    }

    ctx.restore();
  }

  private drawYoaka(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    costume: CostumeId,
    time: number,
    isStriking: boolean,
    isFever: boolean,
    activeTrack: 'air' | 'ground',
    scale: number
  ): void {
    ctx.save();

    this.yoakaTrailHistory.forEach((trail) => {
      ctx.save();
      ctx.translate(x, trail.y);
      ctx.globalAlpha = trail.alpha;
      const trailColor = activeTrack === 'air' ? '#00f0ff' : '#ff007f';
      ctx.strokeStyle = trailColor;
      ctx.lineWidth = 5 * scale * trail.scale;
      ctx.shadowColor = trailColor;
      ctx.shadowBlur = 25 * scale;

      const r = 40 * scale * trail.scale;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      if (this.tissuePackImage && this.tissuePackImage.complete && this.tissuePackImage.naturalWidth !== 0) {
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(this.tissuePackImage, -r * 0.9, -r * 0.9, r * 1.8, r * 1.8);
      }
      ctx.restore();
    });

    ctx.translate(x, y);

    const runCycle = Math.sin(time * 20) * 5 * scale;
    const bodyY = runCycle;

    let mainColor = activeTrack === 'air' ? '#00f0ff' : '#ff007f';
    if (costume === 'office_glasses') mainColor = '#ffe600';

    ctx.shadowColor = isFever ? '#ffe600' : mainColor;
    ctx.shadowBlur = isStriking ? 35 * scale : 18 * scale;

    const r = 40 * scale;
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 4 * scale;
    ctx.beginPath();
    ctx.arc(0, bodyY, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = `900 ${Math.floor(11 * scale)}px "Chakra Petch", sans-serif`;
    ctx.fillStyle = mainColor;
    ctx.textAlign = 'center';
    ctx.fillText(activeTrack === 'air' ? '☁️ AIR' : '🏃 GND', 0, bodyY - 48 * scale);

    if (this.tissuePackImage && this.tissuePackImage.complete && this.tissuePackImage.naturalWidth !== 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, bodyY, r * 0.92, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.tissuePackImage, -r * 0.92, bodyY - r * 0.92, r * 1.84, r * 1.84);
      ctx.restore();
    } else {
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.arc(0, bodyY, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isStriking) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5 * scale;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 25 * scale;
      ctx.beginPath();
      ctx.moveTo(18 * scale, bodyY);
      ctx.lineTo(75 * scale, bodyY - 10 * scale);
      ctx.stroke();

      ctx.font = `900 ${Math.floor(15 * scale)}px "Chakra Petch", sans-serif`;
      ctx.fillStyle = '#ffe600';
      ctx.fillText('V-TISSUES!', 88 * scale, bodyY - 10 * scale);
    }

    ctx.restore();
  }

  public triggerHitEffect(x: number, y: number, text: string, type: 'perfect' | 'great' | 'dodge' | 'damage'): void {
    if (type === 'damage') {
      this.triggerDamageEffect();

      this.particles.push({
        x,
        y: y - 20,
        vx: 0,
        vy: -2.0,
        color: '#ff0055',
        life: 1.2,
        maxLife: 1.2,
        text: `❌ HIT! -6% HP`,
        type: 'damage'
      });

      for (let i = 0; i < 15; i++) {
        this.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.5) * 14,
          color: '#ff0055',
          life: 0.6,
          maxLife: 0.6
        });
      }
      return;
    }

    if (type === 'dodge') {
      this.particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        color: '#00f0ff',
        life: 0.5,
        maxLife: 0.5,
        size: 50
      });

      this.particles.push({
        x,
        y: y - 35,
        vx: 0,
        vy: -3.5,
        color: '#00f0ff',
        life: 1.0,
        maxLife: 1.0,
        text: `✨ DODGE! 成功閃避`,
        type: 'dodge'
      });
      return;
    }

    const isWink = type === 'perfect';
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      color: isWink ? '#ffe600' : '#00f0ff',
      life: 0.45,
      maxLife: 0.45,
      size: 40
    });

    this.particles.push({
      x,
      y: y - 35,
      vx: (Math.random() - 0.5) * 2,
      vy: -4.5,
      color: isWink ? '#ffe600' : '#00f0ff',
      life: 1.0,
      maxLife: 1.0,
      text: isWink ? `WINK! ${text}` : text,
      isWink
    });

    if (text.includes('DUAL')) {
      this.triggerGoldFlashEffect();
    }

    const count = isWink ? 18 : 9;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        color: ['#ff007f', '#00f0ff', '#ffe600', '#ffffff'][Math.floor(Math.random() * 4)],
        life: 0.7,
        maxLife: 0.7
      });
    }
  }

  private updateAndDrawParticles(ctx: CanvasRenderingContext2D, scale: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * scale;
      p.y += p.vy * scale;
      p.life -= 0.025;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;

      if (p.size !== undefined) {
        const currentRadius = (p.size + (1 - p.life / p.maxLife) * 100) * scale;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 5 * scale * (p.life / p.maxLife);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 24 * scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.text) {
        const isDamage = p.type === 'damage';
        const isDual = p.type === 'dual_strike';
        const fontSize = Math.floor((isDamage || isDual ? 32 : p.isWink ? 26 : 20) * scale);
        ctx.font = `900 ${fontSize}px "Chakra Petch", sans-serif`;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 25 * scale;
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12 * scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private drawFeverEffects(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    scale: number
  ): void {
    ctx.save();

    ctx.font = `900 ${Math.floor(32 * scale)}px "Chakra Petch", sans-serif`;
    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 30 * scale;
    ctx.fillText('🔥 FEVER MODE!! 雙倍票數熱血爆發 🔥', width / 2, 45 * scale);

    ctx.restore();
  }
}
