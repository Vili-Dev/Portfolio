document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your user ID
    emailjs.init("ibPtZw_5umIZZ9YJj"); // Replace with your actual EmailJS user ID
    
    // Check if hCaptcha is loaded
    if (typeof hcaptcha === 'undefined') {
        console.error('hCaptcha script not loaded. Please ensure the hCaptcha script is properly included in the HTML.');
        // Disable form submission if hCaptcha is not available
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Le service de sécurité n\'est pas disponible. Impossible d\'envoyer le message.');
            });
        }
        return;
    }

    // Get form elements with null safety checks
    const form = document.getElementById('contactForm');
    if (!form) {
        console.error('Contact form not found in DOM');
        return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) {
        console.error('Submit button not found in contact form');
        return;
    }
    
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingText = submitBtn.querySelector('.loading-text');
    
    if (!submitText || !loadingText) {
        console.error('Submit button text elements not found');
        return;
    }
    
    const formMessage = document.getElementById('formMessage');
    if (!formMessage) {
        console.error('Form message element not found');
        return;
    }
    
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const errorModal = document.getElementById('errorModal');
    const closeErrorModal = document.getElementById('closeErrorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    // Validate modal elements if they exist
    if (successModal && !closeModal) {
        console.error('Success modal close button not found');
        return;
    }
    
    if (errorModal && !closeErrorModal) {
        console.error('Error modal close button not found');
        return;
    }
    
    if (errorModal && !errorMessage) {
        console.error('Error message element not found in error modal');
        return;
    }

    // Language support
    const userLang = navigator.language || navigator.userLanguage;
    const translations = {
        'fr': {
            nameRequired: 'Veuillez entrer votre nom',
            emailRequired: 'Veuillez entrer votre email',
            emailInvalid: 'Veuillez entrer un email valide',
            subjectRequired: 'Veuillez entrer un sujet',
            messageRequired: 'Veuillez entrer votre message',
            messageLength: 'Votre message doit contenir au moins 10 caractères',
            recaptchaRequired: 'Veuillez compléter le reCAPTCHA',
            sending: 'Envoi en cours...',
            sent: 'Message envoyé !',
            sentMessage: 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.',
            error: 'Erreur',
            errorMessage: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.',
            close: 'Fermer'
        },
        'en': {
            nameRequired: 'Please enter your name',
            emailRequired: 'Please enter your email',
            emailInvalid: 'Please enter a valid email',
            subjectRequired: 'Please enter a subject',
            messageRequired: 'Please enter your message',
            messageLength: 'Your message must contain at least 10 characters',
            recaptchaRequired: 'Please complete the reCAPTCHA',
            sending: 'Sending...',
            sent: 'Message sent!',
            sentMessage: 'Thank you for your message. I will reply as soon as possible.',
            error: 'Error',
            errorMessage: 'An error occurred while sending your message. Please try again.',
            close: 'Close'
        }
    };

    const lang = translations[userLang.slice(0, 2)] || translations['fr'];

    // Form validation with enhanced accessibility
    function validateForm() {
        let isValid = true;
        // Get form input elements with null safety
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // Validate that all required form elements exist
        if (!name || !email || !subject || !message) {
            console.error('One or more form input elements not found in DOM');
            return false;
        }
        
        const captchaResponse = hcaptcha.getResponse();

        // Reset previous error messages and ARIA attributes
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
        
        document.querySelectorAll('input, textarea').forEach(el => {
            el.setAttribute('aria-invalid', 'false');
            el.removeAttribute('aria-describedby');
        });

        // Validate name
        if (!name.value.trim()) {
            showError(name, lang.nameRequired);
            name.setAttribute('aria-invalid', 'true');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, lang.emailRequired);
            email.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError(email, lang.emailInvalid);
            email.setAttribute('aria-invalid', 'true');
            isValid = false;
        }

        // Validate subject
        if (!subject.value.trim()) {
            showError(subject, lang.subjectRequired);
            subject.setAttribute('aria-invalid', 'true');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, lang.messageRequired);
            message.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, lang.messageLength);
            message.setAttribute('aria-invalid', 'true');
            isValid = false;
        }

        // Validate hCaptcha
        if (!captchaResponse) {
            const captchaError = document.getElementById('captcha-error');
            captchaError.classList.remove('hidden');
            captchaError.textContent = lang.recaptchaRequired;
            isValid = false;
        }

        return isValid;
    }

    // Show error message with ARIA support
    function showError(input, message) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        const errorId = 'error-' + input.id;
        
        errorDiv.id = errorId;
        errorDiv.classList.remove('hidden');
        errorDiv.textContent = message;
        input.setAttribute('aria-describedby', errorId);
        input.setAttribute('aria-invalid', 'true');
    }

    // Show form message with multilingual support
    function showFormMessage(type, messageKey) {
        const message = lang[messageKey] || messageKey;
        formMessage.className = `form-message mt-4 text-center ${type === 'error' ? 'text-red-400' : 'text-green-400'}`;
        formMessage.textContent = message;
        formMessage.classList.remove('hidden');
        
        // Dispatch custom event for auto-hide
        form.dispatchEvent(new CustomEvent('formMessageShown'));
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        loadingText.classList.remove('hidden');
        loadingText.textContent = lang.sending;

        // Prepare form data for EmailJS with null safety
        const captchaResponse = hcaptcha.getResponse();


        const formData = {
            name: name.value,
            email: email.value,
            subject: subject.value,
            message: message.value,
            'h-captcha-response': captchaResponse
        };

        // Send email using EmailJS
        emailjs.send("service_6krr5v3", "template_x7hq6ob", formData)
        emailjs.send("service_6krr5v3", "template_11rf5q8", formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Reset form
                form.reset();
                hcaptcha.reset();

                // Hide loading state
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                loadingText.classList.add('hidden');

                // Hide any visible messages
                formMessage.classList.add('hidden');

                // Show success message
                showFormMessage('success', 'sent');
                
                // Dispatch event for auto-hide
                form.dispatchEvent(new CustomEvent('formMessageShown'));
            }, function(error) {
                console.error('FORM SUBMISSION FAILED:', error);
                console.error('Error details:', {
                    status: error.status,
                    text: error.text,
                    formData: formData,
                    captchaResponse: hcaptcha.getResponse()
                });
                console.error('EmailJS Configuration:', {
                    serviceID: "service_6krr5v3",
                    templateID: "template_11rf5q8",
                    userID: "ibPtZw_5umIZZ9YJj"
                });
                console.error('Form Validation:', {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value,
                    captchaValid: hcaptcha.getResponse() !== ""
                });

                // Re-enable submit button
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                loadingText.classList.add('hidden');

                // Show error message
                showFormMessage('error', 'errorMessage');
            });
    });

    // Close error modal
    function closeErrorModalHandler() {
        errorModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Reset hCaptcha if error occurred
        hcaptcha.reset();
    }
    
    closeErrorModal.addEventListener('click', closeErrorModalHandler);
    
    // Close error modal when clicking outside
    errorModal.addEventListener('click', function(e) {
        if (e.target === errorModal) {
            closeErrorModalHandler();
        }
    });

    // Add input field animations
    document.querySelectorAll('.contact-form input, .contact-form textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Add hover effect to submit button
    submitBtn.addEventListener('mouseenter', function() {
        gsap.to(this, { scale: 1.02, duration: 0.2 });
    });

    submitBtn.addEventListener('mouseleave', function() {
        gsap.to(this, { scale: 1, duration: 0.2 });
    });

    // Form message auto-hide after 5 seconds
    form.addEventListener('formMessageShown', function() {
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    });
});