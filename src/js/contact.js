document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your user ID
    emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your actual EmailJS user ID

    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitText = submitBtn.querySelector('.submit-text');
    const loadingText = submitBtn.querySelector('.loading-text');
    const formMessage = document.getElementById('formMessage');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');

    // Form validation
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const human = document.getElementById('human');

        // Reset previous error messages
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Veuillez entrer votre nom');
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, 'Veuillez entrer votre email');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError(email, 'Veuillez entrer un email valide');
            isValid = false;
        }

        // Validate subject
        if (!subject.value.trim()) {
            showError(subject, 'Veuillez entrer un sujet');
            isValid = false;
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Veuillez entrer votre message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Votre message doit contenir au moins 10 caractères');
            isValid = false;
        }

        // Validate human check
        if (!human.checked) {
            const humanError = human.parentElement.querySelector('.error-message');
            humanError.classList.remove('hidden');
            humanError.textContent = 'Veuillez confirmer que vous êtes humain';
            isValid = false;
        }

        return isValid;
    }

    // Show error message
    function showError(input, message) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        errorDiv.classList.remove('hidden');
        errorDiv.textContent = message;
    }

    // Show form message
    function showFormMessage(type, message) {
        formMessage.className = `form-message mt-4 text-center ${type === 'error' ? 'text-red-400' : 'text-green-400'}`;
        formMessage.textContent = message;
        formMessage.classList.remove('hidden');
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

        // Prepare form data for EmailJS
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Send email using EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Reset form
                form.reset();
                
                // Hide loading state
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                loadingText.classList.add('hidden');
                
                // Show success modal
                successModal.classList.remove('hidden');
                
                // Animate modal appearance
                gsap.fromTo(successModal,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
                );
            }, function(error) {
                console.log('FAILED...', error);
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitText.classList.remove('hidden');
                loadingText.classList.add('hidden');
                
                // Show error message
                showFormMessage('error', 'Une erreur est survenue. Veuillez réessayer plus tard.');
            });
    });

    // Close success modal
    closeModal.addEventListener('click', function() {
        successModal.classList.add('hidden');
        gsap.to(successModal, { opacity: 0, y: 20, duration: 0.3, ease: "power2.in" });
    });

    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.add('hidden');
            gsap.to(successModal, { opacity: 0, y: 20, duration: 0.3, ease: "power2.in" });
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