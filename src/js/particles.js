class DarkMistParticles {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dark-mist-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.init();
  }

  init() {
    document.body.appendChild(this.canvas);
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.globalCompositeOperation = 'screen';
  }

  createParticles() {
    const particleCount = Math.floor(window.innerWidth / 10);
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 1,
        color: `rgba(168, 84, 200, ${Math.random() * 0.5 + 0.1})`,
        speed: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.02 - 0.01
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      // Movement with slight drift
      p.angle += p.drift;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Mouse interaction
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        p.x -= dx / 100;
        p.y -= dy / 100;
      }

      // Wrap around edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      // Draw particle with glow effect
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      // Add subtle glow
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DarkMistParticles();
});