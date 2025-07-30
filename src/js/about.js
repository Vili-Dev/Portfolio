class AboutSection {
  constructor() {
    this.aboutSection = document.querySelector('.about-section');
    this.profileImage = document.querySelector('.profile-image');
    this.skillBars = document.querySelectorAll('.skill-bar');
    this.techItems = document.querySelectorAll('.tech-item');
    this.easterEgg = document.querySelector('#easter-egg');
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupIntersectionObserver();
    this.createFloatingParticles();
    this.setupEasterEgg();
  }

  bindEvents() {
    // Profile image hover effect
    this.profileImage?.addEventListener('mouseenter', () => {
      this.pulseImage();
    });

    // Skill bars click interaction
    this.skillBars.forEach(bar => {
      bar.addEventListener('click', () => {
        this.expandSkillBar(bar);
      });
    });

    // Technology items hover effects
    this.techItems.forEach(item => {
      this.setupTechHover(item);
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animateSection(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    observer.observe(this.aboutSection);
  }

  animateSection(section) {
    const elements = section.querySelectorAll('.animate-on-scroll');
    
    gsap.fromTo(elements,
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: 'power2.out',
        delay: 0.2
      }
    );
  }

  pulseImage() {
    gsap.timeline()
      .to(this.profileImage, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(this.profileImage, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
  }

  expandSkillBar(bar) {
    const percentage = bar.dataset.level;
    const fill = bar.querySelector('.skill-fill');
    
    // Animate to full width temporarily
    gsap.to(fill, {
      width: '100%',
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
    
    // Reset to actual percentage
    setTimeout(() => {
      gsap.to(fill, {
        width: percentage,
        duration: 1,
        ease: 'elastic.out(1, 0.5)'
      });
    }, 800);
  }

  setupTechHover(item) {
    const icon = item.querySelector('.tech-icon');
    const name = item.querySelector('.tech-name');
    
    item.addEventListener('mouseenter', () => {
      gsap.timeline()
        .to(icon, {
          scale: 1.2,
          rotation: 15,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(name, {
          y: -5,
          color: '#a854c8',
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.2');
    });
    
    item.addEventListener('mouseleave', () => {
      gsap.timeline()
        .to(name, {
          y: 0,
          color: '#c0b5e0',
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.2');
    });
  }

  createFloatingParticles() {
    const container = document.querySelector('.about-content');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      
      // Random properties
      const size = Math.random() * 4 + 1;
      const opacity = Math.random() * 0.5 + 0.1;
      const delay = Math.random() * 3;
      const duration = Math.random() * 10 + 10;
      
      // Position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Style
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #a854c8;
        border-radius: 50%;
        opacity: ${opacity};
        left: ${left}%;
        top: ${top}%;
        pointer-events: none;
        filter: blur(1px);
        animation: float ${duration}s infinite ease-in-out ${delay}s;
      `;
      
      container.appendChild(particle);
    }
  }

  setupEasterEgg() {
    let keys = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
      keys.push(e.key);
      keys = keys.slice(-konamiCode.length);
      
      if (keys.join(',') === konamiCode.join(',')) {
        this.activateEasterEgg();
      }
    });
  }

  activateEasterEgg() {
    // Add anime-inspired effect
    document.body.classList.add('anime-mode');
    
    // Create floating hearts
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement('div');
      heart.className = 'easter-egg-heart';
      heart.innerHTML = '❤️';
      
      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = Math.random() * 3 + 2;
      
      heart.style.cssText = `
        position: fixed;
        font-size: ${size}px;
        left: ${left}%;
        bottom: -50px;
        z-index: 10000;
        pointer-events: none;
        animation: float-up ${duration}s linear ${delay}s forwards;
      `;
      
      document.body.appendChild(heart);
      
      // Remove heart after animation
      setTimeout(() => {
        heart.remove();
      }, (delay + duration) * 1000);
    }
    
    // Show congratulation message
    alert(' Félicitations ! Vous avez trouvé l\'easter egg anime ! 🎉');
    
    // Remove anime mode after 10 seconds
    setTimeout(() => {
      document.body.classList.remove('anime-mode');
    }, 10000);
  }
}

// Initialize about section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AboutSection();
});