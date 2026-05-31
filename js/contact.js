// ============================================================
// ShopFlow — Contact Page Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  
  // Pre-fill if logged in
  if (Auth.isLoggedIn()) {
    const user = Auth.getCurrentUser();
    const nameEl = document.getElementById('contact-name');
    const emailEl = document.getElementById('contact-email');
    
    if (nameEl) nameEl.value = `${user.firstName} ${user.lastName}`;
    if (emailEl) emailEl.value = user.email;
  }
  
  // Handle form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('contact-btn');
      
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      // Simulate network request
      setTimeout(() => {
        contactForm.reset();
        btn.disabled = false;
        btn.textContent = 'Send Message';
        Toast.show('Message sent successfully! We will get back to you soon.', 'success');
      }, 1000);
    });
  }
});
