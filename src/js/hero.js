class HeroSection {
  constructor() {
    this.hero = document.querySelector('.hero');
    this.title = document.querySelector('.hero-title');
    this.subtitle = document.querySelector('.hero-subtitle');
    this.cta = document.querySelector('.cta-button');
    this.scrollIndicator = document.querySelector('.scroll-indicator');
    this.init();
  }

  init() {
    this.animateIn();
    this.bindEvents();
    this.handleScrollAnimation();
  }

  animateIn() {
    // Initial state
    gsap.set([this.title, this.subtitle, this.cta], {
      opacity: 0,
      y: 30
    });

    // Animation sequence
    gsap.timeline()
      .to(this.title, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })
      .to(this.subtitle, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.5')
      .to(this.cta, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        onComplete: () => this.pulseCTA()
      }, '-=0.5');
  }

  pulseCTA() {
    gsap.to(this.cta, {
      scale: 1.05,
      duration: 0.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  bindEvents() {
    // CTA button click
    this.cta?.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToProjects();
    });

    // Scroll indicator click
    this.scrollIndicator?.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToNextSection();
    });

    // Typing effect for subtitle
    this.typeText(this.subtitle, this.subtitle.textContent);
    this.subtitle.textContent = '';
  }

  typeText(element, text) {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
  }

  scrollToProjects() {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  scrollToNextSection() {
    const nextSection = this.hero?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

  handleScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    // Observe elements that should animate on scroll
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
}

// Initialize hero section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HeroSection();
});