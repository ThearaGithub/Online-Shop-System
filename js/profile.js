document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();

  const user = Auth.getCurrentUser();
  if (!user) {
    document.getElementById('profile-container').innerHTML = `
      <div style="text-align:center;padding:80px 20px;">
        <i class="fas fa-user-circle" style="font-size:64px;color:var(--text-muted);margin-bottom:15px;"></i>
        <h2 style="color:white;margin-bottom:10px;">Please Log In</h2>
        <p style="color:var(--text-secondary);margin-bottom:20px;">You need to be logged in to view your profile.</p>
        <a href="login.html" class="btn-primary">Log In</a>
      </div>
    `;
    return;
  }

  renderProfile(user);
});

function renderProfile(user) {
  const container = document.getElementById('profile-container');
  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar-section">
        <div class="profile-avatar" id="profile-avatar">
          ${user.avatar ? `<img src="${user.avatar}" alt="Avatar">` : `<i class="fas fa-user-circle"></i>`}
        </div>
        <label class="btn-upload-avatar" for="avatar-input">
          <i class="fas fa-camera"></i> Change Photo
        </label>
        <input type="file" id="avatar-input" accept="image/*" style="display:none;">
        <h2 id="profile-name-display">${user.firstName} ${user.lastName || ''}</h2>
        <p style="color:var(--text-secondary);font-size:13px;">${user.email}</p>
      </div>
      <form id="profile-form" class="profile-form">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" id="pf-firstname" value="${user.firstName || ''}" required>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" id="pf-lastname" value="${user.lastName || ''}">
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" id="pf-phone" value="${user.phone || ''}" placeholder="012 345 678">
        </div>
        <div class="form-group">
          <label>Delivery Address</label>
          <textarea id="pf-address" rows="3" placeholder="House/Street, Sangkat, Khan, Phnom Penh">${user.address || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="pf-email" value="${user.email || ''}" disabled style="opacity:0.6;">
        </div>
        <button type="submit" class="btn-primary" style="margin-top:10px;">Save Changes</button>
      </form>
    </div>
  `;

  // Avatar upload
  document.getElementById('avatar-input').addEventListener('change', async function() {
    const file = this.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      Toast.show('Uploading...', 'info');
      const res = await fetch('/api/products/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        user.avatar = data.url;
        Auth.updateProfile({ avatar: data.url });
        document.getElementById('profile-avatar').innerHTML = `<img src="${data.url}" alt="Avatar">`;
        // Also save to server
        try {
          await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, avatar: data.url })
          });
        } catch(e) {}
        Toast.show('Photo updated', 'success');
        setTimeout(() => window.location.reload(), 800);
      } else {
        Toast.show('Upload failed', 'error');
      }
    } catch (err) {
      Toast.show('Upload error', 'error');
    }
  });

  // Save profile
  document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const firstName = document.getElementById('pf-firstname').value.trim();
    const lastName = document.getElementById('pf-lastname').value.trim();
    const address = document.getElementById('pf-address').value.trim();
    const phone = document.getElementById('pf-phone').value.trim();
    if (!firstName) {
      Toast.show('First name is required', 'error');
      return;
    }
    const updates = { firstName };
    if (lastName) updates.lastName = lastName;
    if (address) updates.address = address;
    if (phone) updates.phone = phone;
    Auth.updateProfile(updates);
    document.getElementById('profile-name-display').textContent = `${firstName} ${lastName || ''}`;
    // Save to server
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates })
      });
    } catch(e) {}
    Toast.show('Profile updated', 'success');
    setTimeout(() => window.location.reload(), 500);
  });
}
