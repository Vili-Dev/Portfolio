class ProjectsGrid {
  constructor() {
    this.grid = document.querySelector('.projects-grid');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card');
    this.activeFilter = 'all';
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupIntersectionObserver();
    this.shuffleProjects();
  }

  bindEvents() {
    // Filter buttons
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = button.dataset.filter;
        this.filterProjects(filter);
        this.updateActiveFilter(button);
      });
    });

    // Project card hover effects
    this.projectCards.forEach(card => {
      this.setupCardHover(card);
    });

    // Project modal functionality
    this.projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.project-links')) return;
        
        const modal = document.getElementById('project-modal');
        const modalContent = modal.querySelector('.modal-content');
        
        // Get project data from card
        const projectTitle = card.querySelector('.project-title').textContent;
        const projectImage = card.querySelector('.project-image').src;
        const projectDescription = card.querySelector('.project-description').textContent;
        const projectTech = card.dataset.tech;
        
        // Update modal content
        modalContent.innerHTML = `
          <div class="modal-header">
            <h3 class="modal-title">${projectTitle}</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <img src="${projectImage}" alt="${projectTitle}" class="modal-image">
            <p class="modal-description">${projectDescription}</p>
            <div class="modal-tech">
              <strong>Technologies :</strong> ${projectTech}
            </div>
          </div>
          <div class="modal-footer">
            <a href="#" class="modal-link primary">Voir le projet</a>
            <a href="#" class="modal-link secondary">Code source</a>
          </div>
        `;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Close modal
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        });
        
        // Close on click outside
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        });
      });
    });
  }

  setupCardHover(card) {
    const image = card.querySelector('.project-image');
    const overlay = card.querySelector('.project-overlay');
    const title = card.querySelector('.project-title');
    const links = card.querySelector('.project-links');
    
    // Mouse enter
    card.addEventListener('mouseenter', () => {
      gsap.timeline()
        .to(image, {
          scale: 1.1,
          duration: 0.5,
          ease: 'power2.out'
        })
        .to(overlay, {
          opacity: 1,
          duration: 0.3
        }, '-=0.4')
        .to(title, {
          y: -10,
          duration: 0.3
        }, '-=0.2')
        .to(links, {
          y: 0,
          opacity: 1,
          duration: 0.3
        }, '-=0.2');
    });
    
    // Mouse leave
    card.addEventListener('mouseleave', () => {
      gsap.timeline()
        .to(links, {
          y: 10,
          opacity: 0,
          duration: 0.3
        })
        .to(title, {
          y: 0,
          duration: 0.3
        }, '-=0.2')
        .to(overlay, {
          opacity: 0,
          duration: 0.3
        }, '-=0.2')
        .to(image, {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, '-=0.4');
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animateCard(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    this.projectCards.forEach(card => {
      observer.observe(card);
    });
  }

  animateCard(card) {
    const image = card.querySelector('.project-image');
    const title = card.querySelector('.project-title');
    const description = card.querySelector('.project-description');
    const links = card.querySelector('.project-links');

    gsap.set([image, title, description, links], {
      opacity: 0,
      y: 20
    });

    gsap.timeline()
      .to(image, {
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
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.4')
      .to(links, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.3');
  }

  filterProjects(filter) {
    this.activeFilter = filter;
    
    this.projectCards.forEach(card => {
      const projectType = card.dataset.type;
      
      if (filter === 'all' || projectType === filter) {
        card.style.display = 'block';
        // Trigger re-animation
        setTimeout(() => {
          card.classList.remove('visible');
          void card.offsetWidth; // Trigger reflow
          card.classList.add('visible');
        }, 20);
      } else {
        card.style.display = 'none';
      }
    });
  }

  updateActiveFilter(button) {
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  }

  shuffleProjects() {
    // Fisher-Yates shuffle algorithm
    const cards = Array.from(this.projectCards);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.grid.appendChild(cards[j]);
    }
  }

  // Method to add new projects dynamically
  addProject(projectData) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.type = projectData.type;
    card.dataset.tech = projectData.tech;
    card.innerHTML = `
      <div class="project-image-container">
        <img src="${projectData.image}" alt="${projectData.title}" class="project-image">
        <div class="project-overlay">
          <div class="project-info">
            <h3 class="project-title">${projectData.title}</h3>
            <p class="project-description">${projectData.description}</p>
            <div class="project-links">
              <a href="${projectData.demo}" class="project-link" target="_blank">Voir</a>
              <a href="${projectData.github}" class="project-link" target="_blank">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.grid.appendChild(card);
    this.projectCards = document.querySelectorAll('.project-card');
    this.setupCardHover(card);
    this.setupIntersectionObserver();
  }
}

// Initialize projects grid when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsGrid();
});