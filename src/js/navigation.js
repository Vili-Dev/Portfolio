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
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.nav.classList.remove('nav-open');
          this.menuToggle.classList.remove('active');
          this.updateAria();
        }
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

    // Smooth scrolling for all nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        this.scrollToSection(targetId);
      });
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
      // Close mobile menu
      this.nav.classList.remove('nav-open');
      this.menuToggle.classList.remove('active');
      this.updateAria();

      // Scroll to target with smooth behavior
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL hash without jumping
      history.pushState(null, null, targetId);
    }
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ResponsiveNavigation();
});