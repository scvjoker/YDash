import { Note, CostumeId, GameStats } from '../types/game';

export class RenderEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private bgImage: HTMLImageElement | null = null;
  private yoakaMainImage: HTMLImageElement | null = null;
  private yoakaDefaultImage: HTMLImageElement | null = null;
  private yoakaOfficeImage: HTMLImageElement | null = null;
  private yoakaKpopImage: HTMLImageElement | null = null;
  private tissueImage: HTMLImageElement | null = null;
  private dogBoardImage: HTMLImageElement | null = null;
  private sharkImage: HTMLImageElement | null = null;

  private hitEffects: Array<{
    x: number;
    y: number;
    text: string;
    type: 'perfect' | 'great' | 'miss' | 'damage' | 'dodge';
    life: number;
  }> = [];

  private damageFlashLife: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.loadAssets();
  }

  private loadAssets(): void {
    this.bgImage = new Image();
    this.bgImage.src = '/cyber_runway_bg.jpg';

    this.yoakaMainImage = new Image();
    this.yoakaMainImage.src = '/yoaka_main.jpg';

    this.yoakaDefaultImage = new Image();
    this.yoakaDefaultImage.src = '/assets/yoaka_default.png';

    this.yoakaOfficeImage = new Image();
    this.yoakaOfficeImage.src = '/assets/yoaka_office.png';

    this.yoakaKpopImage = new Image();
    this.yoakaKpopImage.src = '/assets/yoaka_kpop.png';

    this.tissueImage = new Image();
    this.tissueImage.src = '/assets/tissue_pack.png';

    this.dogBoardImage = new Image();
    this.dogBoardImage.src = '/assets/hater_dog_board.png';

    this.sharkImage = new Image();
    this.sharkImage.src = '/assets/hater_shark.png';
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public triggerHitEffect(x: number, y: number, text: string, type: 'perfect' | 'great' | 'miss' | 'damage' | 'dodge'): void {
    this.hitEffects.push({ x, y, text, type, life: 1.0 });
  }

  public triggerDamageEffect(): void {
    this.damageFlashLife = 1.0;
  }

  public render(
    currentTime: number,
    notes: Note[],
    costume: CostumeId,
    stats: GameStats,
    inputState: { airActive: boolean; groundActive: boolean },
    activeTrack: 'air' | 'ground',
    speedMultiplier: number = 1.0
  ): void {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Responsive Scale Equation
    const scale = Math.min(1.8, Math.max(0.60, height / 640));

    this.ctx.clearRect(0, 0, width, height);

    // 1. Multi-Tile Seamless Scrollable Cyber Runway Background
    if (this.bgImage && this.bgImage.complete && this.bgImage.naturalWidth > 0) {
      const scrollSpeed = 220 * speedMultiplier;
      const scrollX = (currentTime * scrollSpeed) % (width * 1.5);
      const bgW = this.bgImage.naturalWidth * (height / this.bgImage.naturalHeight);

      let currentX = -scrollX;
      while (currentX < width) {
        this.ctx.drawImage(this.bgImage, currentX, 0, bgW + 1.5, height);
        currentX += bgW;
      }
    } else {
      this.ctx.fillStyle = '#0a0b1e';
      this.ctx.fillRect(0, 0, width, height);
    }

    // 2. Air and Ground Track Lines
    const airTrackY = height * 0.36;
    const groundTrackY = height * 0.70;

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

    // Track Rails
    this.ctx.lineWidth = Math.floor(4 * scale);
    this.ctx.strokeStyle = activeTrack === 'air' ? '#00f0ff88' : 'rgba(0, 240, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, airTrackY);
    this.ctx.lineTo(width, airTrackY);
    this.ctx.stroke();

    this.ctx.strokeStyle = activeTrack === 'ground' ? '#ff007f88' : 'rgba(255, 0, 127, 0.2)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, groundTrackY);
    this.ctx.lineTo(width, groundTrackY);
    this.ctx.stroke();

    // 3. Target Receptors (Target Crosshairs)
    const targetX = width * 0.22;
    const receptorRadius = Math.floor(28 * scale);

    // Air Target Receptor
    this.ctx.lineWidth = inputState.airActive ? Math.floor(6 * scale) : Math.floor(3 * scale);
    this.ctx.strokeStyle = inputState.airActive ? '#00f0ff' : '#00f0ffaa';
    this.ctx.fillStyle = inputState.airActive ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 240, 255, 0.1)';
    this.ctx.beginPath();
    this.ctx.arc(targetX, airTrackY, receptorRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Ground Target Receptor
    this.ctx.lineWidth = inputState.groundActive ? Math.floor(6 * scale) : Math.floor(3 * scale);
    this.ctx.strokeStyle = inputState.groundActive ? '#ff007f' : '#ff007faa';
    this.ctx.fillStyle = inputState.groundActive ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 0, 127, 0.1)';
    this.ctx.beginPath();
    this.ctx.arc(targetX, groundTrackY, receptorRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // 4. Render Notes & DUAL STRIKE Synchronized Laser Lines
    const speed = 460 * speedMultiplier;

    // Render Dual Laser Connector Lines between Air & Ground
    notes.forEach(note => {
      if (note.hit || !note.isDual) return;
      const noteX = targetX + (note.time - currentTime) * speed;

      if (noteX >= targetX - 50 && noteX <= width + 50) {
        this.ctx.save();
        this.ctx.lineWidth = Math.floor(6 * scale);
        this.ctx.strokeStyle = '#ffe600';
        this.ctx.shadowColor = '#ffe600';
        this.ctx.shadowBlur = 18 * scale;
        this.ctx.beginPath();
        this.ctx.moveTo(noteX, airTrackY);
        this.ctx.lineTo(noteX, groundTrackY);
        this.ctx.stroke();
        this.ctx.restore();
      }
    });

    notes.forEach(note => {
      if (note.hit) return;

      const noteX = targetX + (note.time - currentTime) * speed;
      if (noteX < targetX - 80 || noteX > width + 80) return;

      const noteY = note.track === 'air' ? airTrackY : groundTrackY;

      // A. Obstacle Note
      if (note.type === 'obstacle') {
        const obsSize = Math.floor(58 * scale);
        const img = note.entity === 'hater_shark' ? this.sharkImage : this.dogBoardImage;

        if (img && img.complete && img.naturalWidth > 0) {
          this.ctx.drawImage(img, noteX - obsSize / 2, noteY - obsSize / 2, obsSize, obsSize);
        } else {
          this.ctx.fillStyle = '#ff0055';
          this.ctx.fillRect(noteX - obsSize / 2, noteY - obsSize / 2, obsSize, obsSize);
        }

        this.ctx.strokeStyle = '#ff0055';
        this.ctx.lineWidth = Math.floor(3 * scale);
        this.ctx.strokeRect(noteX - obsSize / 2, noteY - obsSize / 2, obsSize, obsSize);
      }
      // B. Voter Note (Includes Genuine DUAL STRIKE Gold Notes)
      else {
        const noteRadius = Math.floor(24 * scale);

        this.ctx.save();
        if (note.isDual) {
          this.ctx.fillStyle = 'rgba(255, 230, 0, 0.85)';
          this.ctx.strokeStyle = '#ffe600';
          this.ctx.shadowColor = '#ffe600';
          this.ctx.shadowBlur = 20 * scale;
        } else {
          this.ctx.fillStyle = note.track === 'air' ? 'rgba(0, 240, 255, 0.8)' : 'rgba(255, 0, 127, 0.8)';
          this.ctx.strokeStyle = note.track === 'air' ? '#00f0ff' : '#ff007f';
          this.ctx.shadowColor = note.track === 'air' ? '#00f0ff' : '#ff007f';
          this.ctx.shadowBlur = 12 * scale;
        }

        this.ctx.lineWidth = Math.floor(3 * scale);
        this.ctx.beginPath();
        this.ctx.arc(noteX, noteY, noteRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Render Tissue Pack Icon
        if (this.tissueImage && this.tissueImage.complete && this.tissueImage.naturalWidth > 0) {
          const tSize = Math.floor(30 * scale);
          this.ctx.drawImage(this.tissueImage, noteX - tSize / 2, noteY - tSize / 2, tSize, tSize);
        }

        // Dual Badge Label
        if (note.isDual) {
          this.ctx.font = `900 ${Math.floor(11 * scale)}px "Chakra Petch", sans-serif`;
          this.ctx.fillStyle = '#000';
          this.ctx.textAlign = 'center';
          this.ctx.fillText('⚡DUAL', noteX, noteY + 3 * scale);
        }

        this.ctx.restore();
      }
    });

    // 5. Left Hero Character Standee
    const heroX = width * 0.08;
    const heroY = activeTrack === 'air' ? airTrackY : groundTrackY;
    const heroSize = Math.floor(110 * scale);

    if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
      this.ctx.save();
      this.ctx.shadowColor = accentColor;
      this.ctx.shadowBlur = 25 * scale;
      this.ctx.drawImage(targetImg, heroX - heroSize / 2, heroY - heroSize / 2, heroSize, heroSize);
      this.ctx.restore();
    }

    // Hero Badge Label
    this.ctx.font = `900 ${Math.floor(13 * scale)}px "Chakra Petch", sans-serif`;
    this.ctx.fillStyle = accentColor;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(costumeName, heroX, heroY + heroSize / 2 + 16 * scale);

    // 6. FEVER Atmosphere Glow
    if (stats.isFeverActive) {
      this.ctx.save();
      this.ctx.strokeStyle = '#ff007f';
      this.ctx.lineWidth = Math.floor(10 * scale);
      this.ctx.shadowColor = '#ff007f';
      this.ctx.shadowBlur = 30 * scale;
      this.ctx.strokeRect(0, 0, width, height);
      this.ctx.restore();
    }

    // 7. Red Screen Damage Flash Effect
    if (this.damageFlashLife > 0) {
      this.ctx.save();
      this.ctx.fillStyle = `rgba(255, 0, 85, ${this.damageFlashLife * 0.35})`;
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.restore();
      this.damageFlashLife -= 0.05;
    }

    // 8. Hit Judgment Feedback Floating Texts
    for (let i = this.hitEffects.length - 1; i >= 0; i--) {
      const fx = this.hitEffects[i];
      fx.life -= 0.035;
      fx.y -= 1.5 * scale;

      if (fx.life <= 0) {
        this.hitEffects.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = fx.life;
      this.ctx.font = `900 ${Math.floor(22 * scale)}px "Chakra Petch", sans-serif`;

      let col = '#00f0ff';
      if (fx.type === 'perfect') col = '#ffe600';
      else if (fx.type === 'great') col = '#00ff87';
      else if (fx.type === 'damage') col = '#ff0055';
      else if (fx.type === 'dodge') col = '#ff007f';

      this.ctx.fillStyle = col;
      this.ctx.shadowColor = col;
      this.ctx.shadowBlur = 12 * scale;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(fx.text, fx.x, fx.y);
      this.ctx.restore();
    }
  }
}
