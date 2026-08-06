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
}

export class RenderEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: HitParticle[] = [];

  // Assets Images
  private bgImage: HTMLImageElement | null = null;
  private yoakaImage: HTMLImageElement | null = null;
  private voterOfficeImage: HTMLImageElement | null = null;
  private voterStudentImage: HTMLImageElement | null = null;
  private haterDogImage: HTMLImageElement | null = null;
  private haterSharkImage: HTMLImageElement | null = null;
  private tissuePackImage: HTMLImageElement | null = null;

  // Yoaka Runway Smooth Y Position
  private yoakaCurrentY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.loadAssets();
  }

  private loadAssets(): void {
    this.bgImage = this.createImage('/cyber_runway_bg.jpg');
    this.yoakaImage = this.createImage('/yoaka_main.jpg');
    this.voterOfficeImage = this.createImage('/assets/voter_office.jpg');
    this.voterStudentImage = this.createImage('/assets/voter_student.jpg');
    this.haterDogImage = this.createImage('/assets/hater_dog_board.jpg');
    this.haterSharkImage = this.createImage('/assets/hater_shark.jpg');
    this.tissuePackImage = this.createImage('/assets/tissue_pack.jpg');
  }

  private createImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public render(
    currentTime: number,
    notes: Note[],
    costume: CostumeId,
    stats: { supportRate: number; isFeverActive: boolean; combo: number },
    inputState: { airActive: boolean; groundActive: boolean },
    activeTrack: 'air' | 'ground' = 'ground'
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
    const noteSpeed = width * 0.45;

    // Smooth Yoaka Track Switch Animation
    const targetYoakaY = activeTrack === 'air' ? airY : groundY;
    if (this.yoakaCurrentY === 0) this.yoakaCurrentY = groundY;
    this.yoakaCurrentY += (targetYoakaY - this.yoakaCurrentY) * 0.25;

    // 2. Draw Dual Tracks
    this.drawTracks(ctx, width, height, airY, groundY, currentTime, stats.isFeverActive);

    // 3. Draw Target Hit Zones
    this.drawHitZone(ctx, hitX, airY, inputState.airActive, '#00f0ff');
    this.drawHitZone(ctx, hitX, groundY, inputState.groundActive, '#ff007f');

    // 4. Draw Active Notes & Dual Beams & Long Mash Bars
    const activeDualNotes: { [time: number]: { airX?: number; groundX?: number } } = {};

    for (const note of notes) {
      if (note.hit) continue;
      const timeDiff = note.time - currentTime;
      const noteX = hitX + timeDiff * noteSpeed;

      if (noteX >= -200 && noteX <= width + 300) {
        const noteY = note.track === 'air' ? airY : groundY;

        if (note.isDual) {
          if (!activeDualNotes[note.time]) activeDualNotes[note.time] = {};
          if (note.track === 'air') activeDualNotes[note.time].airX = noteX;
          if (note.track === 'ground') activeDualNotes[note.time].groundX = noteX;
        }

        // Draw Long Mash Bar Ribbon if isMash
        if (note.isMash) {
          this.drawLongMashBar(ctx, noteX, noteY, noteSpeed * (note.duration || 1.8), currentTime);
        }

        // Draw 150% Enlarged Note Entity (115px ~ 125px)
        this.drawNoteEntity(ctx, note, noteX, noteY, currentTime);
      }
    }

    // Draw Dual Strike Beams
    Object.values(activeDualNotes).forEach(dual => {
      if (dual.airX !== undefined && dual.groundX !== undefined) {
        this.drawDualBeam(ctx, dual.airX, airY, groundY, currentTime);
      }
    });

    // 5. Draw Hero Yoaka Stage running dynamically on Air/Ground Track
    this.drawYoaka(ctx, hitX, this.yoakaCurrentY, costume, currentTime, inputState.airActive || inputState.groundActive, stats.isFeverActive, activeTrack);

    // 6. Start Buffer Countdown Text
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

    // 7. Draw Fever Effects
    if (stats.isFeverActive) {
      this.drawFeverEffects(ctx, width, height, currentTime);
    }

    // 8. Update & Draw Particles & Shockwaves
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

    const radius = isActive ? 58 : 46; // Enlarged hit zone
    ctx.strokeStyle = color;
    ctx.lineWidth = isActive ? 7 : 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = isActive ? 35 : 18;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isActive ? color : 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawDualBeam(
    ctx: CanvasRenderingContext2D,
    x: number,
    airY: number,
    groundY: number,
    time: number
  ): void {
    ctx.save();
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 24;

    ctx.beginPath();
    ctx.moveTo(x, airY);
    ctx.lineTo(x, groundY);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, (airY + groundY) / 2 + Math.sin(time * 20) * 30, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Long Rapid Mash Ribbon / Bar
  private drawLongMashBar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    barWidth: number,
    time: number
  ): void {
    ctx.save();
    ctx.translate(x, y);

    const barHeight = 44;
    const grad = ctx.createLinearGradient(0, 0, barWidth, 0);
    grad.addColorStop(0, '#ffe600');
    grad.addColorStop(0.5, '#ff007f');
    grad.addColorStop(1, '#00f0ff');

    ctx.fillStyle = grad;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 20;

    // Slanted Long Bar Ribbon
    ctx.beginPath();
    ctx.roundRect(0, -barHeight / 2, barWidth, barHeight, 14);
    ctx.fill();

    // Stripes Pattern Inside Bar
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 4;
    const stripeOffset = (time * 120) % 20;
    for (let sx = -stripeOffset; sx < barWidth; sx += 20) {
      ctx.beginPath();
      ctx.moveTo(sx, -barHeight / 2);
      ctx.lineTo(sx - 10, barHeight / 2);
      ctx.stroke();
    }

    // Label Text on Bar
    ctx.font = '900 16px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔥 MASH連打區塊 瘋狂拍擊! 🔥', barWidth / 2, 0);

    ctx.restore();
  }

  // Draw 150% Enlarged Note Entity (115px ~ 125px)
  private drawNoteEntity(
    ctx: CanvasRenderingContext2D,
    note: Note,
    x: number,
    y: number,
    time: number
  ): void {
    ctx.save();
    ctx.translate(x, y);

    const bounce = Math.sin(time * 12) * 5;
    const size = 118; // Enlarged +150% to ~118px!

    let targetImg: HTMLImageElement | null = null;
    let label = 'VOTER';
    let borderColor = note.isDual ? '#ffe600' : '#00f0ff';

    if (note.entity === 'voter_office') {
      targetImg = this.voterOfficeImage;
      label = 'VOTER';
    } else if (note.entity === 'voter_student' || note.entity === 'voter_cloud') {
      targetImg = this.voterStudentImage;
      label = 'STUDENT';
    } else if (note.entity === 'hater_dog_board') {
      targetImg = this.haterDogImage;
      label = 'HATER';
      borderColor = '#ff0055';
    } else if (note.entity === 'hater_shark_rose') {
      targetImg = this.haterSharkImage;
      label = 'SHARK';
      borderColor = '#ff007f';
    } else if (note.entity === 'tissue_bonus') {
      targetImg = this.tissuePackImage;
      label = 'TISSUE';
      borderColor = '#ffe600';
    }

    if (note.isMash) {
      label = 'MASH!';
      borderColor = '#ffe600';
    }

    if (targetImg && targetImg.complete && targetImg.naturalWidth !== 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = note.isDual ? 6 : 4;
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = 25;

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, bounce, size / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(targetImg, -size / 2, bounce - size / 2, size, size);
      ctx.restore();
    } else {
      ctx.fillStyle = borderColor;
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(0, bounce, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (note.isDual) {
      ctx.font = '900 14px "Chakra Petch", sans-serif';
      ctx.fillStyle = '#ffe600';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 12;
      ctx.fillText('⚡ DUAL!', 0, bounce - 68);
    } else if (note.isMash) {
      ctx.font = '900 14px "Chakra Petch", sans-serif';
      ctx.fillStyle = '#ffe600';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 14;
      ctx.fillText('🔥 MASH連打!', 0, bounce - 68);
    }

    ctx.font = '900 15px "Chakra Petch", sans-serif';
    ctx.fillStyle = borderColor;
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, bounce + 72);

    ctx.restore();
  }

  // Draw Hero Yoaka Stage (Smoothly switches & runs on Air / Ground Track)
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
    ctx.translate(x, y);

    const runCycle = Math.sin(time * 20) * 6;
    const bodyY = runCycle;

    let mainColor = activeTrack === 'air' ? '#00f0ff' : '#ff007f';
    if (costume === 'office_glasses') mainColor = '#ffe600';

    ctx.shadowColor = isFever ? '#ffe600' : mainColor;
    ctx.shadowBlur = isStriking ? 40 : 20;

    // Dynamic Motion Trail Glow Lines
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, bodyY, 46, 0, Math.PI * 2);
    ctx.stroke();

    // Track Indicator Pill Tag on Hero
    ctx.font = '900 12px "Chakra Petch", sans-serif';
    ctx.fillStyle = mainColor;
    ctx.textAlign = 'center';
    ctx.fillText(activeTrack === 'air' ? '☁️ AIR RUNNER' : '🏃 GROUND RUNNER', 0, bodyY - 56);

    if (this.yoakaImage && this.yoakaImage.complete && this.yoakaImage.naturalWidth !== 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, bodyY, 43, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(this.yoakaImage, -43, bodyY - 43, 86, 86);
      ctx.restore();
    } else {
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.arc(0, bodyY, 43, 0, Math.PI * 2);
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

  public triggerHitEffect(x: number, y: number, text: string, isPerfect: boolean): void {
    const isWink = isPerfect;

    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      color: isPerfect ? '#ffe600' : '#00f0ff',
      life: 0.45,
      maxLife: 0.45,
      size: 40
    });

    this.particles.push({
      x,
      y: y - 35,
      vx: (Math.random() - 0.5) * 2,
      vy: -4.5,
      color: isPerfect ? '#ffe600' : '#00f0ff',
      life: 1.0,
      maxLife: 1.0,
      text: isWink ? `WINK! ${text}` : text,
      isWink
    });

    const count = isPerfect ? 18 : 9;
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
        ctx.font = p.isWink ? '900 28px "Chakra Petch", sans-serif' : '700 22px "Chakra Petch", sans-serif';
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
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
