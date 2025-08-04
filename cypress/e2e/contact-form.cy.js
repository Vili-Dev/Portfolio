// Cypress End-to-End Test for Contact Form
// Validates form submission flow and email integration

describe('Contact Form', () => {
  // Set viewport size for consistent testing
  beforeEach(() => {
    cy.viewport(1366, 768);
  });

  it('should display contact form with all required elements', () => {
    cy.visit('/');
    
    // Verify form elements in the DOM
    cy.get('#contactForm').should('exist');
    cy.get('#name').should('exist');
    cy.get('#email').should('exist');
    cy.get('#subject').should('exist');
    cy.get('#message').should('exist');
    cy.get('button[type="submit"]').should('exist');
    
    // Verify error message containers
    cy.get('#error-name').should('exist');
    cy.get('#error-email').should('exist');
    cy.get('#error-subject').should('exist');
    cy.get('#error-message').should('exist');
    cy.get('#captcha-error').should('exist');
  });

  it('should validate required fields', () => {
    cy.visit('/');
    
    // Submit empty form
    cy.get('button[type="submit"]').click();
    
    // Check for validation errors
    cy.get('#error-name').should('be.visible');
    cy.get('#error-email').should('be.visible');
    cy.get('#error-subject').should('be.visible');
    cy.get('#error-message').should('be.visible');
    cy.get('#captcha-error').should('be.visible');
    
    // Fill name field
    cy.get('#name').type('John Doe');
    cy.get('button[type="submit"]').click();
    
    // Name error should disappear
    cy.get('#error-name').should('not.be.visible');
    // Other errors should remain
    cy.get('#error-email').should('be.visible');
    cy.get('#error-subject').should('be.visible');
    cy.get('#error-message').should('be.visible');
    cy.get('#captcha-error').should('be.visible');
  });

  it('should validate email format', () => {
    cy.visit('/');
    
    // Fill name and invalid email
    cy.get('#name').type('John Doe');
    cy.get('#email').type('invalid-email');
    cy.get('button[type="submit"]').click();
    
    // Email error should appear
    cy.get('#error-email').should('be.visible');
    
    // Fix email format
    cy.get('#email').clear();
    cy.get('#email').type('john@example.com');
    cy.get('button[type="submit"]').click();
    
    // Email error should disappear
    cy.get('#error-email').should('not.be.visible');
  });

  it('should validate message length', () => {
    cy.visit('/');
    
    // Fill required fields
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#subject').type('Test Subject');
    
    // Short message
    cy.get('#message').type('short');
    cy.get('button[type="submit"]').click();
    
    // Message error should appear
    cy.get('#error-message').should('be.visible');
    
    // Fix message length
    cy.get('#message').clear();
    cy.get('#message').type('This is a sufficiently long message for testing purposes.');
    cy.get('button[type="submit"]').click();
    
    // Message error should disappear
    cy.get('#error-message').should('not.be.visible');
  });

  it('should handle hCaptcha integration', () => {
    cy.visit('/');
    
    // Initial state - hCaptcha not completed
    cy.get('#captcha-error').should('not.be.visible');
    
    // Fill form with valid data
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#subject').type('Test Subject');
    cy.get('#message').type('Test message');
    
    // Submit without completing hCaptcha
    cy.get('button[type="submit"]').click();
    
    // hCaptcha error should appear
    cy.get('#captcha-error').should('be.visible');
  });

  it('should successfully submit form with valid data', () => {
    // This test requires mocking the emailjs service
    // since we can't actually send emails in testing
    
    cy.visit('/');
    
    // Fill form with valid data
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#subject').type('Test Subject');
    cy.get('#message').type('This is a test message that is long enough to pass validation.');
    
    // Mock emailjs.send
    cy.window().then((window) => {
      window.emailjs = {
        send: cy.stub().resolves({
          status: 200,
          text: 'OK'
        })
      };
    });
    
    // Mock hcaptcha
    cy.window().then((window) => {
      window.hcaptcha = {
        getResponse: () => 'valid-captcha-response',
        reset: cy.stub()
      };
    });
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify loading state
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('.submit-text').should('not.be.visible');
    cy.get('.loading-text').should('be.visible');
    
    // Wait for submission to complete
    cy.wait(1000);
    
    // Verify success message
    cy.get('#formMessage').should('be.visible');
    cy.get('#formMessage').should('contain', 'Message envoyé !');
    
    // Verify form was reset
    cy.get('#name').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#subject').should('have.value', '');
    cy.get('#message').should('have.value', '');
    
    // Verify hCaptcha was reset
    cy.window().then((window) => {
      expect(window.hcaptcha.reset).to.be.called;
    });
    
    // Verify emailjs.send was called with correct data
    cy.window().then((window) => {
      expect(window.emailjs.send).to.be.calledWith(
        "service_6krr5v3", 
        "template_11rf5q8", 
        {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message that is long enough to pass validation.',
          'h-captcha-response': 'valid-captcha-response'
        }
      );
    });
  });

  it('should handle form submission errors', () => {
    cy.visit('/');
    
    // Fill form with valid data
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#subject').type('Test Subject');
    cy.get('#message').type('Test message');
    
    // Mock emailjs.send to reject
    cy.window().then((window) => {
      window.emailjs = {
        send: cy.stub().rejects({
          status: 500,
          text: 'Internal Server Error'
        })
      };
    });
    
    // Mock hcaptcha
    cy.window().then((window) => {
      window.hcaptcha = {
        getResponse: () => 'valid-captcha-response',
        reset: cy.stub()
      };
    });
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify loading state
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('.submit-text').should('not.be.visible');
    cy.get('.loading-text').should('be.visible');
    
    // Wait for submission to complete
    cy.wait(1000);
    
    // Verify error message
    cy.get('#formMessage').should('be.visible');
    cy.get('#formMessage').should('contain', 'Une erreur est survenue');
    
    // Verify submit button was re-enabled
    cy.get('button[type="submit"]').should('not.be.disabled');
    
    // Verify hCaptcha was reset
    cy.window().then((window) => {
      expect(window.hcaptcha.reset).to.be.called;
    });
    
    // Verify emailjs.send was called
    cy.window().then((window) => {
      expect(window.emailjs.send).to.be.called;
    });
  });

  it('should auto-hide success message after 5 seconds', () => {
    cy.visit('/');
    
    // Fill form with valid data
    cy.get('#name').type('John Doe');
    cy.get('#email').type('john@example.com');
    cy.get('#subject').type('Test Subject');
    cy.get('#message').type('Test message');
    
    // Mock successful submission
    cy.window().then((window) => {
      window.emailjs = {
        send: cy.stub().resolves({
          status: 200,
          text: 'OK'
        })
      };
    });
    
    cy.window().then((window) => {
      window.hcaptcha = {
        getResponse: () => 'valid-captcha-response',
        reset: cy.stub()
      };
    });
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Wait for success message
    cy.wait(1000);
    
    // Success message should be visible
    cy.get('#formMessage').should('be.visible');
    
    // Wait for auto-hide (5 seconds + buffer)
    cy.wait(6000);
    
    // Success message should be hidden
    cy.get('#formMessage').should('not.be.visible');
  });
});