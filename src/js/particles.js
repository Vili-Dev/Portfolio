class DarkParticleBackground {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dark-particles-canvas';
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
    
    // Initialize mouse position
    this.mouse = { x: 0, y: 0 };
    this.bindEvents();
    
    this.resize();
    this.initParticles();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    const particleCount = Math.floor(window.innerWidth / 5);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 3 + 2,  // Maximum visibility
        color: `rgba(168, 84, 200, ${Math.random() * 0.7 + 0.5})`,  // High visibility (min 0.5 opacity)
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.005 - 0.002
      });
    }
  }

  animate() {
    // Clear with slightly less transparency for better visibility
    // Clear canvas completely (no trail effect)
    this.ctx.fillStyle = 'rgba(5, 2, 8, 1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      // Movement with slight drift
      p.angle += p.drift;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Mouse interaction with subtle repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {  // Increased interaction radius
        const force = (150 - distance) / 150;
        p.x -= dx * force * 0.02;  // Increased repulsion force
        p.y -= dy * force * 0.02;
      }

      // Wrap around edges
      if (p.x < -p.radius) p.x = this.canvas.width + p.radius;
      if (p.x > this.canvas.width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = this.canvas.height + p.radius;
      if (p.y > this.canvas.height + p.radius) p.y = -p.radius;

      // Draw particle with subtle glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.radius * 5  // Maximum glow radius
      );
      
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'rgba(168, 84, 200, 0.05)');  // Slight outer glow
      
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DarkParticleBackground();
});