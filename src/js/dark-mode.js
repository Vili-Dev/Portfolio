class DarkModeToggle {
  constructor() {
    this.toggle = document.querySelector('.dark-mode-toggle');
    this.isDarkMode = true;
    this.init();
  }

  init() {
    // Check user preference
    this.checkUserPreference();
    
    // Bind events
    this.bindEvents();
    
    // Update toggle state
    this.updateToggle();
  }

  checkUserPreference() {
    // Check for saved preference
    const savedPreference = localStorage.getItem('darkMode');
    if (savedPreference !== null) {
      this.isDarkMode = savedPreference === 'true';
    } else {
      // Check system preference
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Apply mode
    this.applyMode();
  }

  bindEvents() {
    // Toggle button click
    this.toggle?.addEventListener('click', () => {
      this.toggleMode();
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        this.isDarkMode = e.matches;
        this.applyMode();
        this.updateToggle();
      }
    });
  }

  toggleMode() {
    this.isDarkMode = !this.isDarkMode;
    this.applyMode();
    this.updateToggle();
    
    // Save preference
    localStorage.setItem('darkMode', this.isDarkMode);
    
    // Dispatch event for other components
    document.dispatchEvent(new CustomEvent('darkModeChanged', {
      detail: { isDarkMode: this.isDarkMode }
    }));
  }

  applyMode() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }

  updateToggle() {
    if (this.toggle) {
      this.toggle.innerHTML = this.isDarkMode 
        ? '<span class="toggle-icon">☀️</span> Mode Clair' 
        : '<span class="toggle-icon">🌙</span> Mode Sombre';
    }
  }
}

// Initialize dark mode toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DarkModeToggle();
});