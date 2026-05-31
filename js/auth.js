// ============================================================
// ShopFlow — Authentication Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  
  // Redirect to home if already logged in
  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  // Handle Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errorDiv = document.getElementById('login-error');
      const btn = document.getElementById('login-btn');
      
      // Reset
      errorDiv.classList.remove('show');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      
      setTimeout(async () => {
        const result = await Auth.login(email, password);
        if (result.success) {
          Toast.show(`Welcome back, ${result.user.firstName}!`, 'success');
          
          // If admin, go to admin page, else home
          setTimeout(() => {
            if (result.user.role === 'admin') {
              window.location.href = 'admin.html';
            } else {
              window.location.href = 'index.html';
            }
          }, 1000);
        } else {
          errorDiv.textContent = result.message;
          errorDiv.classList.add('show');
          btn.disabled = false;
          btn.textContent = 'Log In';
        }
      }, 800); // Fake network delay
    });
  }

  // Handle Signup
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const terms = document.getElementById('terms').checked;
      
      const errorDiv = document.getElementById('signup-error');
      const btn = document.getElementById('signup-btn');
      
      // Reset
      errorDiv.classList.remove('show');
      
      if (!terms) {
        errorDiv.textContent = 'You must agree to the Terms of Service.';
        errorDiv.classList.add('show');
        return;
      }
      
      if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters.';
        errorDiv.classList.add('show');
        return;
      }
      
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      
      setTimeout(async () => {
        const result = await Auth.signup(firstName, lastName, email, password);
        if (result.success) {
          Toast.show(`Account created! Welcome, ${result.user.firstName}!`, 'success');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        } else {
          errorDiv.textContent = result.message;
          errorDiv.classList.add('show');
          btn.disabled = false;
          btn.textContent = 'Create Account';
        }
      }, 1000); // Fake network delay
    });
  }
});

// ─── PASSWORD VISIBILITY TOGGLE ───────────────────────────────
window.togglePassword = function(inputId, el) {
  const input = document.getElementById(inputId);
  const icon = el.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'far fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'far fa-eye';
  }
};
