class DarkMistParticles {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dark-mist-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0.7';
    this.canvas.style.mixBlendMode = 'soft-light';
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.sections = document.querySelectorAll('section');
    this.currentSectionIndex = 0;
    this.isTransitioning = false;
    
    // Store reference to this instance
    this.init();
    
    // Make this instance globally accessible
    document.darkMistInstance = this;
  }

  init() {
    document.body.appendChild(this.canvas);
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
    this.initScrollTransitions();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.shadowColor = 'rgba(168, 84, 200, 0.5)';
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
    // Clear with semi-transparent black for trail effect
    this.ctx.fillStyle = 'rgba(5, 2, 8, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      // Movement with slight drift
      p.angle += p.drift;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Mouse interaction with repulsion
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 150) {
        const force = (150 - distance) / 150;
        p.x -= dx * force * 0.02;
        p.y -= dy * force * 0.02;
        
        // Increase glow near mouse
        this.ctx.shadowBlur = 20 * force;
      } else {
        this.ctx.shadowBlur = 15;
      }

      // Wrap around edges with soft edges
      if (p.x < -p.radius) p.x = this.canvas.width + p.radius;
      if (p.x > this.canvas.width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = this.canvas.height + p.radius;
      if (p.y > this.canvas.height + p.radius) p.y = -p.radius;

      // Draw particle with enhanced glow effect
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      // Create gradient for inner glow
      const gradient = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.radius * 3
      );
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'rgba(168, 84, 200, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
  
  // Enhanced method to handle section transitions with mist effect
  createSectionTransitionEffect() {
    // Create a mist overlay that sweeps across the screen
    const mistOverlay = {
      x: 0,
      y: 0,
      width: 0,
      height: window.innerHeight,
      alpha: 0,
      direction: 'right'
    };
    
    // Animation timeline for the mist transition
    const timeline = gsap.timeline({
      onComplete: () => {
        this.isTransitioning = false;
      }
    });
    
    // Sweep from left to right
    timeline.to(mistOverlay, {
      width: window.innerWidth,
      duration: 0.6,
      ease: "power2.inOut",
      onUpdate: () => {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the mist overlay
        this.ctx.fillStyle = `rgba(5, 2, 8, ${mistOverlay.alpha})`;
        this.ctx.fillRect(mistOverlay.x, mistOverlay.y, mistOverlay.width, mistOverlay.height);
        
        // Continue drawing particles
        this.particles.forEach(p => {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          
          const gradient = this.ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.radius * 3
          );
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'rgba(168, 84, 200, 0)');
          
          this.ctx.fillStyle = gradient;
          this.ctx.fill();
        });
      }
    });
    
    // Fade in the mist
    timeline.to(mistOverlay, {
      alpha: 0.8,
      duration: 0.3,
      ease: "power1.inOut"
    }, "-=0.3");
    
    // Hold the mist
    timeline.to(mistOverlay, {
      duration: 0.2
    });
    
    // Fade out the mist
    timeline.to(mistOverlay, {
      alpha: 0,
      duration: 0.3,
      ease: "power1.inOut"
    });
    
    return timeline;
  }
  
  // Method to trigger transition when navigating between sections
  triggerSectionTransition(direction = 'next') {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Determine current section based on scroll position
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    let newSectionIndex = this.currentSectionIndex;
    if (direction === 'next') {
      newSectionIndex = Math.min(this.currentSectionIndex + 1, this.sections.length - 1);
    } else if (direction === 'prev') {
      newSectionIndex = Math.max(this.currentSectionIndex - 1, 0);
    }
    
    // If already at the limit, don't transition
    if (newSectionIndex === this.currentSectionIndex) {
      this.isTransitioning = false;
      return;
    }
    
    // Create and play the transition effect
    const transitionTimeline = this.createSectionTransitionEffect();
    transitionTimeline.play();
    
    // After transition, scroll to the new section
    transitionTimeline.eventCallback("onComplete", () => {
      const targetSection = this.sections[newSectionIndex];
      if (targetSection) {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: targetSection,
            autoKill: true
          },
          ease: "power2.out"
        });
      }
      this.currentSectionIndex = newSectionIndex;
    });
  }
  
  // Initialize scroll listeners for automatic transitions
  initScrollTransitions() {
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
      
      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set new timeout to detect scroll end
      scrollTimeout = setTimeout(() => {
        // Check if we've scrolled to a new section
        const currentSection = Math.floor(scrollTop / window.innerHeight);
        
        if (currentSection !== this.currentSectionIndex && !this.isTransitioning) {
          this.triggerSectionTransition(scrollDirection === 'down' ? 'next' : 'prev');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }, 150);
    });
  }
}

// Initialize particles when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DarkMistParticles();
});