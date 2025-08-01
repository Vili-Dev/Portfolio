class ResponsiveNavigation {
  constructor() {
    this.nav = document.querySelector('.main-nav');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.header = document.querySelector('header');
    this.isSticky = false;
    this.init();
  }

  init() {
    this.createMobileMenu();
    this.bindEvents();
    this.handleScroll();
    this.handleHashChange();
  }

  createMobileMenu() {
    // Create mobile menu toggle
    if (!this.menuToggle) {
      const toggle = document.createElement('button');
      toggle.className = 'menu-toggle';
      toggle.innerHTML = `
        <span class="hamburger"></span>
        <span class="hamburger"></span>
        <span class="hamburger"></span>
      `;
      toggle.setAttribute('aria-label', 'Menu');
      this.header.appendChild(toggle);
      this.menuToggle = toggle;
    }

    // Add mobile class to nav links
    this.navLinks.forEach(link => {
      link.classList.add('nav-link-mobile');
    });
  }

  bindEvents() {
    // Mobile menu toggle
    this.menuToggle?.addEventListener('click', () => {
      this.nav.classList.toggle('nav-open');
      this.menuToggle.classList.toggle('active');
      this.updateAria();
    });

    // Close menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        // Close mobile menu
        if (window.innerWidth <= 768) {
          this.nav.classList.remove('nav-open');
          this.menuToggle.classList.remove('active');
          this.updateAria();
        }
        
        // Navigate to section
        this.scrollToSection(targetId);
      });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.nav.classList.remove('nav-open');
        this.menuToggle.classList.remove('active');
      }
      this.updateAria();
    });

    // Handle scroll for sticky header
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });
  }

  updateAria() {
    const isExpanded = this.nav.classList.contains('nav-open');
    this.menuToggle.setAttribute('aria-expanded', isExpanded);
  }

  handleScroll() {
    const scrollPosition = window.scrollY;
    const shouldStick = scrollPosition > 100;

    if (shouldStick !== this.isSticky) {
      this.header.classList.toggle('sticky', shouldStick);
      this.isSticky = shouldStick;
    }
  }

  scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
      // Check if we have the particles instance
      if (window.darkMistParticles && typeof window.darkMistParticles.triggerSectionTransition === 'function') {
        // Determine direction based on target position
        const currentScroll = window.scrollY;
        const targetPosition = target.offsetTop;
        const direction = targetPosition > currentScroll ? 'next' : 'prev';
        
        // Use the mist transition effect
        window.darkMistParticles.triggerSectionTransition(direction);
      } else {
        // Fallback to direct GSAP scroll
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: target.offsetTop - this.header.offsetHeight,
            autoKill: true
          },
          ease: "power2.out",
          onComplete: () => {
            // Update URL hash without jumping
            history.pushState(null, null, targetId);
            
            // Update active link
            this.updateActiveLink(targetId);
          }
        });
      }
    }
  }
  
  updateActiveLink(targetId) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });
    
    // Add active class to current link
    const currentLink = document.querySelector(`.nav-link[href="${targetId}"]`);
    if (currentLink) {
      currentLink.classList.add('active');
      currentLink.setAttribute('aria-current', 'page');
    }
  }
  
  handleHashChange() {
    // Handle initial hash on page load
    this.handleInitialHash();
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleInitialHash();
    });
  }
  
  handleInitialHash() {
    const hash = window.location.hash || '#home';
    this.updateActiveLink(hash);
    
    // If we have a hash, scroll to that section
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        // Use GSAP for smoother scrolling animation on page load
        setTimeout(() => {
          gsap.to(window, {
            duration: 1,
            scrollTo: {
              y: target,
              autoKill: true
            },
            ease: "power2.out"
          });
        }, 100);
      }
    }
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ResponsiveNavigation();
});