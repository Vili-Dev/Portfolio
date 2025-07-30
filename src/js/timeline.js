class InteractiveTimeline {
  constructor() {
    this.timeline = document.querySelector('.timeline');
    this.entries = document.querySelectorAll('.timeline-entry');
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.bindEvents();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animateEntry(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.entries.forEach(entry => {
      observer.observe(entry);
    });
  }

  animateEntry(entry) {
    const content = entry.querySelector('.timeline-content');
    const year = entry.querySelector('.timeline-year');
    const title = entry.querySelector('.timeline-title');
    const description = entry.querySelector('.timeline-description');

    // Reset animation
    gsap.set([year, title, description], {
      opacity: 0,
      y: 20
    });

    // Create timeline animation
    gsap.timeline()
      .to(year, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      })
      .to(title, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3')
      .to(description, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.4');
  }

  bindEvents() {
    // Add hover effects
    this.entries.forEach(entry => {
      entry.addEventListener('mouseenter', () => {
        this.highlightEntry(entry);
      });

      entry.addEventListener('mouseleave', () => {
        this.resetEntry(entry);
      });
    });

    // Add click interaction for mobile
    this.entries.forEach(entry => {
      entry.addEventListener('click', () => {
        // On mobile, toggle active state
        if (window.innerWidth <= 768) {
          entry.classList.toggle('active');
          
          // Animate content if becoming active
          if (entry.classList.contains('active')) {
            this.animateEntry(entry);
          }
        }
      });
    });
  }

  highlightEntry(entry) {
    // Darken other entries
    this.entries.forEach(e => {
      if (e !== entry) {
        e.style.opacity = '0.4';
        e.style.transform = 'scale(0.98)';
      }
    });

    // Enhance current entry
    gsap.to(entry, {
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Pulse the marker
    const marker = entry.querySelector('.timeline-marker');
    gsap.to(marker, {
      scale: 1.2,
      opacity: 0.8,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  resetEntry(entry) {
    // Reset all entries
    this.entries.forEach(e => {
      e.style.opacity = '';
      e.style.transform = '';
    });

    // Reset current entry scale
    gsap.to(entry, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Reset marker
    const marker = entry.querySelector('.timeline-marker');
    gsap.to(marker, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  // Method to add new timeline entries dynamically
  addEntry(data) {
    const entry = document.createElement('div');
    entry.className = 'timeline-entry';
    entry.innerHTML = `
      <div class="timeline-marker">
        <div class="marker-dot"></div>
        <div class="marker-line"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-year">${data.year}</div>
        <h3 class="timeline-title">${data.title}</h3>
        <p class="timeline-description">${data.description}</p>
      </div>
    `;

    this.timeline.appendChild(entry);
    this.entries = document.querySelectorAll('.timeline-entry');
    this.setupIntersectionObserver();
  }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new InteractiveTimeline();
});