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

  // Assets Images
  private bgImage: HTMLImageElement | null = null;
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
    this.bgImage = this.loadSmartImage(['/cyber_runway_bg.png', '/cyber_runway_bg.jpg', '/cyber_runway_bg.jpeg', '/cyber_runway_bg.webp']);
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

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Parallax Background
    this.drawBackground(ctx, width, height, currentTime, stats.isFeverActive);

    // Tracks Positions
    const airY = height * 0.38;
    const groundY = height * 0.72;
    const hitX = width * 0.22;
    const noteSpeed = width * 0.45 * speedMultiplier;

    // Smooth Yoaka Track Switch Animation & Extended High-Vis Trail Tracking
    const targetYoakaY = activeTrack === 'air' ? airY : groundY;
    if (this.yoakaCurrentY === 0) {
      this.yoakaCurrentY = groundY;
    }

    const moveDiffY = targetYoakaY - this.yoakaCurrentY;
    if (Math.abs(moveDiffY) > 1.5) {
      // Record Extended 14-Step Trail History
      this.yoakaTrailHistory.unshift({ y: this.yoakaCurrentY, alpha: 0.85, scale: 1.0 });
      if (this.yoakaTrailHistory.length > 14) {
        this.yoakaTrailHistory.pop();
      }
    }
    this.yoakaCurrentY += moveDiffY * 0.22;

    // Update Trail History slow decay
    this.yoakaTrailHistory.forEach((trail, idx) => {
      trail.alpha -= 0.045;
      trail.scale = Math.max(0.6, 1.0 - idx * 0.03);
    });
    this.yoakaTrailHistory = this.yoakaTrailHistory.filter(t => t.alpha > 0);

    // 2. Draw Dual Tracks
    this.drawTracks(ctx, width, height, airY, groundY, currentTime, stats.isFeverActive);

    // 3. Draw Clean Target Hit Zones
    this.drawHitZone(ctx, hitX, airY, inputState.airActive, '#00f0ff');
    this.drawHitZone(ctx, hitX, groundY, inputState.groundActive, '#ff007f');

    // Dual Press: Golden Beam Connection Line
    if (inputState.airActive && inputState.groundActive) {
      this.drawGoldenLaserBeam(ctx, hitX, airY, groundY);
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

        this.drawCleanVectorNote(ctx, note, noteX, noteY, currentTime);
      }
    }

    // Draw Golden Dual Beams for Dual Notes
    Object.values(activeDualNotes).forEach(dual => {
      if (dual.airX !== undefined && dual.groundX !== undefined) {
        this.drawGoldenLaserBeam(ctx, dual.airX, airY, groundY);
      }
    });

    // 5. Draw Borderless Hero Side Standee with Breathing Pulse Motion!
    this.drawHeroSideCard2X(ctx, hitX - 220, this.yoakaCurrentY, costume, currentTime, activeTrack);

    // 6. Draw Hero Runner Stage (Elongated Trail Afterimages)
    this.drawYoaka(ctx, hitX, this.yoakaCurrentY, costume, currentTime, inputState.airActive || inputState.groundActive, stats.isFeverActive, activeTrack);

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

    // 8. Start & Unpause Buffer Countdown Text
    if (currentTime < 4.8) {
      const countdown = Math.ceil(5.0 - currentTime);
      ctx.save();
      ctx.font = '900 48px "Chakra Petch", sans-serif';
      ctx.fillStyle = '#ffe600';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff007f';
      ctx.shadowBlur = 25;
      ctx.fillText(`⚡ 準備拜票！音符將在 ${countdown} 秒後抵達 ⚡`, width / 2, height * 0.2);
      ctx.restore();
    }

    // 9. Draw Fever Effects
    if (stats.isFeverActive) {
      this.drawFeverEffects(ctx, width, height, currentTime);
    }

    // 10. Update & Draw Particles & Shockwaves
    this.updateAndDrawParticles(ctx);
  }

  private drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    isFever: boolean
  ): void {
    if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth !== 0) {
      const speed = 80;
      const bgW = this.bgImage.width * (height / this.bgImage.height);
      const scrollX = (time * speed) % bgW;

      ctx.drawImage(this.bgImage, -scrollX, 0, bgW, height);
      ctx.drawImage(this.bgImage, bgW - scrollX, 0, bgW, height);

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
    isFever: boolean
  ): void {
    ctx.save();
    
    ctx.strokeStyle = isFever ? '#ff007f' : '#00f0ff';
    ctx.lineWidth = 4;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 14;
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
    color: string
  ): void {
    ctx.save();
    ctx.translate(x, y);

    const radius = isActive ? 52 : 42;
    ctx.strokeStyle = color;
    ctx.lineWidth = isActive ? 6 : 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = isActive ? 30 : 15;

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
    groundY: number
  ): void {
    ctx.save();

    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 10;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 35;

    ctx.beginPath();
    ctx.moveTo(x, airY);
    ctx.lineTo(x, groundY);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(x, airY);
    ctx.lineTo(x, groundY);
    ctx.stroke();

    ctx.restore();
  }

  // Borderless Hero Standee with Breathing Pulse Motion (No Black Box & No Frame Artifacts!)
  private drawHeroSideCard2X(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    costume: CostumeId,
    time: number,
    activeTrack: 'air' | 'ground'
  ): void {
    ctx.save();
    ctx.translate(x, y);

    // Breathing Pulse Sine Wave (Scale 0.96x ~ 1.04x)
    const breathScale = 1.0 + Math.sin(time * 3.5) * 0.04;
    const baseW = 310;
    const baseH = 310;
    const cardW = baseW * breathScale;
    const cardH = baseH * breathScale;

    let accentColor = activeTrack === 'air' ? '#00f0ff' : '#ff007f';
    let costumeName = '👑 預設競選背心裝';
    let targetImg = this.yoakaDefaultImage || this.yoakaMainImage;

    if (costume === 'office_glasses') {
      accentColor = '#ffe600';
      costumeName = '👓 襯衫領帶眼鏡裝';
      targetImg = this.yoakaOfficeImage || this.yoakaMainImage;
    } else if (costume === 'kpop_idol') {
      accentColor = '#ff007f';
      costumeName = '✨ K-Pop 閃耀偶像裝';
      targetImg = this.yoakaKpopImage || this.yoakaMainImage;
    }

    // Borderless Dynamic Neon Glow Effect (No Black Box background or border lines!)
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 45;

    if (targetImg && targetImg.complete && targetImg.naturalWidth !== 0) {
      ctx.save();
      // Rounded image clip for soft edges without black background
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 24);
      ctx.clip();
      ctx.drawImage(targetImg, -cardW / 2, -cardH / 2, cardW, cardH);
      ctx.restore();
    }

    // Clean Floating Costume Label Pill
    ctx.font = '900 15px "Chakra Petch", sans-serif';
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 18;
    ctx.fillText(costumeName, 0, cardH / 2 + 22);

    ctx.restore();
  }

  private drawCleanVectorNote(
    ctx: CanvasRenderingContext2D,
    note: Note,
    x: number,
    y: number,
    time: number
  ): void {
    ctx.save();
    ctx.translate(x, y);

    const bounce = Math.sin(time * 14) * 4;
    const isObstacle = note.type === 'obstacle' || note.entity.startsWith('hater');

    if (isObstacle) {
      const size = 360;
      const targetHaterImg = note.entity === 'hater_dog_board' ? this.haterDogImage : this.haterSharkImage;

      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 100;

      if (targetHaterImg && targetHaterImg.complete && targetHaterImg.naturalWidth !== 0) {
        ctx.drawImage(targetHaterImg, -size / 2, bounce - size / 2, size, size);
      } else {
        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.arc(0, bounce, size / 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = '900 20px "Chakra Petch", sans-serif';
      ctx.fillStyle = '#ff0055';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 24;
      ctx.fillText('⚠️ DODGE 閃避!', 0, bounce + size / 2 + 20);

    } else {
      const isAir = note.track === 'air';
      const mainColor = note.isDual ? '#ffe600' : isAir ? '#00f0ff' : '#ff007f';
      const radius = 38;

      ctx.fillStyle = mainColor;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = 20;

      ctx.beginPath();
      ctx.arc(0, bounce, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, bounce, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '900 13px "Chakra Petch", sans-serif';
      ctx.fillStyle = mainColor;
      ctx.textAlign = 'center';
      ctx.fillText(note.isDual ? '⚡ DUAL' : isAir ? 'AIR VOTER' : 'GND VOTER', 0, bounce + 50);
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
    activeTrack: 'air' | 'ground'
  ): void {
    ctx.save();

    this.yoakaTrailHistory.forEach((trail) => {
      ctx.save();
      ctx.translate(x, trail.y);
      ctx.globalAlpha = trail.alpha;
      const trailColor = activeTrack === 'air' ? '#00f0ff' : '#ff007f';
      ctx.strokeStyle = trailColor;
      ctx.lineWidth = 6 * trail.scale;
      ctx.shadowColor = trailColor;
      ctx.shadowBlur = 30;

      const r = 44 * trail.scale;
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

    const runCycle = Math.sin(time * 20) * 6;
    const bodyY = runCycle;

    let mainColor = activeTrack === 'air' ? '#00f0ff' : '#ff007f';
    if (costume === 'office_glasses') mainColor = '#ffe600';

    ctx.shadowColor = isFever ? '#ffe600' : mainColor;
    ctx.shadowBlur = isStriking ? 40 : 20;

    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, bodyY, 44, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '900 12px "Chakra Petch", sans-serif';
    ctx.fillStyle = mainColor;
    ctx.textAlign = 'center';
    ctx.fillText(activeTrack === 'air' ? '☁️ AIR (上軌閃避/發紙)' : '🏃 GND (地面軌奔跑)', 0, bodyY - 54);

    if (this.tissuePackImage && this.tissuePackImage.complete && this.tissuePackImage.naturalWidth !== 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, bodyY, 41, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.tissuePackImage, -41, bodyY - 41, 82, 82);
      ctx.restore();
    } else {
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.arc(0, bodyY, 41, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isStriking) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.moveTo(20, bodyY);
      ctx.lineTo(85, bodyY - 12);
      ctx.stroke();

      ctx.font = '900 18px "Chakra Petch", sans-serif';
      ctx.fillStyle = '#ffe600';
      ctx.fillText('V-TISSUES!', 100, bodyY - 12);
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

  private updateAndDrawParticles(ctx: CanvasRenderingContext2D): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life / p.maxLife;

      if (p.size !== undefined) {
        const currentRadius = p.size + (1 - p.life / p.maxLife) * 100;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 5 * (p.life / p.maxLife);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.text) {
        const isDamage = p.type === 'damage';
        const isDual = p.type === 'dual_strike';
        ctx.font = isDamage || isDual ? '900 34px "Chakra Petch", sans-serif' : p.isWink ? '900 28px "Chakra Petch", sans-serif' : '700 22px "Chakra Petch", sans-serif';
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 25;
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private drawFeverEffects(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ): void {
    ctx.save();

    ctx.font = '900 38px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 30;
    ctx.fillText('🔥 FEVER MODE!! 雙倍票數熱血爆發 🔥', width / 2, 50);

    ctx.restore();
  }
}
