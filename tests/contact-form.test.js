// Contact Form Regression Test Suite
// Validates form functionality, validation, and submission

describe('Contact Form', () => {
  // Test form element existence
  test('should have all required form elements', () => {
    const form = document.getElementById('contactForm');
    expect(form).toBeTruthy();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    expect(nameInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
    expect(subjectInput).toBeTruthy();
    expect(messageInput).toBeTruthy();
    expect(submitBtn).toBeTruthy();
  });

  // Test form validation - empty fields
  test('should show validation errors for empty required fields', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Clear all fields
    nameInput.value = '';
    emailInput.value = '';
    subjectInput.value = '';
    messageInput.value = '';
    
    // Trigger form submission
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    // Check for error messages
    const nameError = document.getElementById('error-name');
    const emailError = document.getElementById('error-email');
    const subjectError = document.getElementById('error-subject');
    const messageError = document.getElementById('error-message');
    
    expect(nameError.classList.contains('hidden')).toBe(false);
    expect(emailError.classList.contains('hidden')).toBe(false);
    expect(subjectError.classList.contains('hidden')).toBe(false);
    expect(messageError.classList.contains('hidden')).toBe(false);
  });

  // Test email validation
  test('should validate email format', () => {
    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('error-email');
    
    // Test invalid email
    emailInput.value = 'invalid-email';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(emailError.classList.contains('hidden')).toBe(false);
    
    // Test valid email
    emailInput.value = 'test@example.com';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(emailError.classList.contains('hidden')).toBe(true);
  });

  // Test message length validation
  test('should validate message length (minimum 10 characters)', () => {
    const form = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('error-message');
    
    // Test short message
    messageInput.value = 'short';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(messageError.classList.contains('hidden')).toBe(false);
    
    // Test long enough message
    messageInput.value = 'This message is long enough to pass validation.';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(messageError.classList.contains('hidden')).toBe(true);
  });

  // Test successful form submission (mocked)
  test('should successfully submit form with valid data', () => {
    // Mock emailjs.send
    const emailjsSendMock = jest.fn().mockResolvedValue({
      status: 200,
      text: 'OK'
    });
    window.emailjs = {
      send: emailjsSendMock
    };
    
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingText = submitBtn.querySelector('.loading-text');
    
    // Fill form with valid data
    nameInput.value = 'John Doe';
    emailInput.value = 'john@example.com';
    subjectInput.value = 'Test Subject';
    messageInput.value = 'This is a test message that is long enough.';
    
    // Mock hcaptcha
    window.hcaptcha = {
      getResponse: () => 'valid-captcha-response',
      reset: () => {}
    };
    
    // Trigger form submission
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    // Check loading state
    expect(submitBtn.disabled).toBe(true);
    expect(submitText.classList.contains('hidden')).toBe(true);
    expect(loadingText.classList.contains('hidden')).toBe(false);
    
    // Wait for async operation
    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
      // Check emailjs.send was called with correct data
      expect(emailjsSendMock).toHaveBeenCalledWith(
        "service_6krr5v3", 
        "template_11rf5q8", 
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message that is long enough.',
          'h-captcha-response': 'valid-captcha-response'
        })
      );
    });
  });

  // Test form reset after successful submission
  test('should reset form after successful submission', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    
    // Fill form
    nameInput.value = 'John Doe';
    messageInput.value = 'Test message';
    
    // Mock successful submission
    const emailjsSendMock2 = jest.fn().mockResolvedValue({
      status: 200,
      text: 'OK'
    });
    window.emailjs = {
      send: emailjsSendMock2
    };
    
    window.hcaptcha = {
      getResponse: () => 'valid-captcha-response',
      reset: jest.fn()
    };
    
    // Trigger submission
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    // Wait for async operation
    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
      // Form should be reset
      expect(nameInput.value).toBe('');
      expect(emailjsSendMock2).toHaveBeenCalled();
      expect(messageInput.value).toBe('');
      expect(window.hcaptcha.reset).toHaveBeenCalled();
    });
  });

  // Test error handling
  test('should handle form submission errors', () => {
    // Mock emailjs.send to reject
    const emailjsSendMock3 = jest.fn().mockRejectedValue({
      status: 500,
      text: 'Internal Server Error'
    });
    window.emailjs = {
      send: emailjsSendMock3
    };
    
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('formMessage');
    
    // Fill form
    nameInput.value = 'John Doe';
    messageInput.value = 'Test message';
    
    // Mock hcaptcha
    window.hcaptcha = {
      getResponse: () => 'valid-captcha-response',
      reset: jest.fn()
    };
    
    // Trigger submission
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    
    // Wait for async operation
    return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
      // Check error message is shown
      expect(formMessage.classList.contains('hidden')).toBe(false);
      expect(emailjsSendMock3).toHaveBeenCalled();
      expect(formMessage.textContent).toContain('Une erreur est survenue');
      
      // Submit button should be re-enabled
      expect(submitBtn.disabled).toBe(false);
      
      // hCaptcha should be reset
      expect(window.hcaptcha.reset).toHaveBeenCalled();
    });
  });

  // Test input field animations
  test('should add focused class on input focus', () => {
    const nameInput = document.getElementById('name');
    const parent = nameInput.parentElement;
    
    // Trigger focus
    nameInput.dispatchEvent(new Event('focus'));
    
    expect(parent.classList.contains('focused')).toBe(true);
    
    // Trigger blur with value
    nameInput.value = 'Test';
    nameInput.dispatchEvent(new Event('blur'));
    
    expect(parent.classList.contains('focused')).toBe(true);
    
    // Trigger blur without value
    nameInput.value = '';
    nameInput.dispatchEvent(new Event('blur'));
    
    expect(parent.classList.contains('focused')).toBe(false);
  });

  // Test submit button hover effects
  test('should animate submit button on hover', () => {
    const submitBtn = document.querySelector('button[type="submit"]');
    
    // We can't test GSAP animations directly, but we can check if the event listeners are attached
    const hasMouseEnter = getEventListeners(submitBtn, 'mouseenter');
    const hasMouseLeave = getEventListeners(submitBtn, 'mouseleave');
    
    expect(hasMouseEnter.length).toBeGreaterThan(0);
    expect(hasMouseLeave.length).toBeGreaterThan(0);
  });

  // Test form message auto-hide
  test('should auto-hide form message after 5 seconds', () => {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Show message
    formMessage.classList.remove('hidden');
    
    // Dispatch custom event
    form.dispatchEvent(new CustomEvent('formMessageShown'));
    
    // Check message is hidden after 5 seconds
    return new Promise(resolve => setTimeout(resolve, 5100)).then(() => {
      expect(formMessage.classList.contains('hidden')).toBe(true);
    });
  });
});

// Helper function to get event listeners (mock implementation)
function getEventListeners(element, eventType) {
  // This is a simplified mock - in real testing, you might use a testing library
  // that can access event listeners or test the behavior instead
  return element.hasAttribute('on' + eventType) ? [{}] : [];
}