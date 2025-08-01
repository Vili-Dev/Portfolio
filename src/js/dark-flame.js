class DarkFlameBackground {
  constructor() {
    console.log('DarkFlameBackground initialized');
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dark-flame-canvas';
    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '-1',
      pointerEvents: 'none'
    });
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.initFlames();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    console.log('Canvas resized:', this.canvas.width, 'x', this.canvas.height);
  }

  initFlames() {
    this.flames = [];
    for (let i = 0; i < 12; i++) {
      this.flames.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height - 20,  // Positionnées près du bas
        width: 80 + Math.random() * 120,
        height: 100 + Math.random() * 150,  // Hauteur réduite
        hue: 270,
        saturation: 100,
        lightness: 15,  // Luminosité réduite (plus sombre)
        alpha: 0.5,     // Opacité réduite
        speed: 0.8 + Math.random() * 1.2,  // Vitesse réduite
        flicker: 0
      });
    }
  }

  animate() {
    this.ctx.fillStyle = 'rgba(5, 2, 8, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.flames.forEach(flame => {
      flame.y -= flame.speed;
      flame.x += Math.sin(Date.now() * 0.002) * 0.5;
      
      if (flame.y < -flame.height) {
        flame.y = this.canvas.height;
        flame.x = Math.random() * this.canvas.width;
      }
      
      const gradient = this.ctx.createLinearGradient(
        0, flame.y, 
        0, flame.y - flame.height * 1.2
      );
      
      gradient.addColorStop(0, `hsla(${flame.hue}, ${flame.saturation}%, 25%, ${flame.alpha})`);  // Couleur plus sombre
      gradient.addColorStop(0.3, `hsla(${flame.hue}, ${flame.saturation}%, 20%, ${flame.alpha * 0.8})`);  // Couleur plus sombre
      gradient.addColorStop(1, `hsla(${flame.hue}, ${flame.saturation}%, 10%, 0)`);
      
      const width = flame.width * (1 + Math.sin(Date.now() * 0.005) * 0.3);
      this.ctx.beginPath();
      this.ctx.moveTo(flame.x, flame.y);
      this.ctx.bezierCurveTo(
        flame.x - width * 0.7, flame.y - flame.height * 0.3,
        flame.x + width * 0.8, flame.y - flame.height * 0.6,
        flame.x, flame.y - flame.height
      );
      this.ctx.bezierCurveTo(
        flame.x + width * 0.7, flame.y - flame.height * 0.6,
        flame.x - width * 0.6, flame.y - flame.height * 0.3,
        flame.x, flame.y
      );
      
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      this.ctx.shadowColor = 'hsla(270, 100%, 40%, 0.4)';  // Glow réduit
      this.ctx.shadowBlur = 15;  // Effet de flou réduit
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'source-over';
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  new DarkFlameBackground();
});