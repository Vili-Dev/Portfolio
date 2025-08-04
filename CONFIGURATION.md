# Configuration Guide for Contact Form

## hCaptcha Setup

1. Go to [hCaptcha Dashboard](https://dashboard.hcaptcha.com/)
2. Sign up or log in to your account
3. Click "Add Site" and enter:
   - Site name: Portfolio Website
   - Domains: portfolino.netlify.app
   - Type: "I am not a robot" Checkbox
4. Click "Create" to generate your keys
5. Update the following in your code:

**In index.html:**
```html
<div class="h-captcha" data-sitekey="YOUR_HCAPTCHA_SITE_KEY"></div>
```

**In src/js/contact.js:**
```javascript
// Replace YOUR_HCAPTCHA_SITE_KEY with your actual site key
// The backend should verify the token using your secret key
```

## EmailJS Configuration

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up or log in to your account
3. Create a new service (e.g., Gmail, Outlook, etc.)
4. Create a new email template with the following variables:
   - name
   - email
   - subject
   - message
   - h-captcha-response
5. Update the following in your code:

**In src/js/contact.js:**
```javascript
// Initialize EmailJS
emailjs.init("YOUR_USER_ID");

// Update service and template IDs
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
```

## Environment Variables (Recommended)

For security, store sensitive information in environment variables:

```env
EMAILJS_USER_ID=your_user_id
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
HCAPTCHA_SECRET_KEY=your_secret_key
```

Then access them in your code accordingly.