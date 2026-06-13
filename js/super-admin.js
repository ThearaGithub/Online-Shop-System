document.addEventListener('DOMContentLoaded', () => {
  renderHeader();

  if (!Auth.isLoggedIn() || Auth.getCurrentUser().role !== 'superadmin') {
    Toast.show('Access Denied. Super Admins only.', 'error');
    window.location.href = 'index.html';
    return;
  }

  renderSuperAdminDashboard();
});

function showAddAdminForm() {
  document.getElementById('add-admin-form').style.display = 'block';
}

function hideAddAdminForm() {
  document.getElementById('add-admin-form').style.display = 'none';
  document.getElementById('add-admin-msg').textContent = '';
}

async function createAdmin() {
  const firstName = document.getElementById('new-admin-firstname').value.trim();
  const lastName = document.getElementById('new-admin-lastname').value.trim();
  const email = document.getElementById('new-admin-email').value.trim();
  const password = document.getElementById('new-admin-password').value;
  const role = document.getElementById('new-admin-role').value;
  const msgEl = document.getElementById('add-admin-msg');

  if (!firstName || !lastName || !email || !password) {
    msgEl.innerHTML = '<span style="color: #ff4757;">Please fill in all fields.</span>';
    return;
  }

  try {
    const res = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, role })
    });
    const data = await res.json();
    if (data.success) {
      msgEl.innerHTML = '<span style="color: #28a745;">Admin created successfully!</span>';
      document.getElementById('new-admin-firstname').value = '';
      document.getElementById('new-admin-lastname').value = '';
      document.getElementById('new-admin-email').value = '';
      document.getElementById('new-admin-password').value = '';
      setTimeout(() => {
        hideAddAdminForm();
        renderSuperAdminDashboard();
      }, 1000);
    } else {
      msgEl.innerHTML = `<span style="color: #ff4757;">${data.message}</span>`;
    }
  } catch (err) {
    msgEl.innerHTML = '<span style="color: #ff4757;">Network error.</span>';
  }
}

async function renderSuperAdminDashboard() {
  try {
    // Fetch today's analytics
    const analyticsRes = await fetch('/api/admin/analytics/today');
    const analytics = await analyticsRes.json();

    document.getElementById('stat-today-orders').textContent = analytics.today.orderCount;
    document.getElementById('stat-today-revenue').textContent = formatPrice(analytics.today.totalRevenue);
    document.getElementById('stat-today-profit').textContent = formatPrice(analytics.today.estimatedProfit);
    document.getElementById('stat-today-avg').textContent = formatPrice(analytics.today.avgOrderValue);
    document.getElementById('stat-total-orders').textContent = analytics.lifetime.totalOrders;
    document.getElementById('stat-lifetime-revenue').textContent = formatPrice(analytics.lifetime.totalRevenue);
    document.getElementById('stat-pending-orders').textContent = analytics.pending;

    // Fetch all users
    const allUsers = await Auth.getUsers();
    const admins = allUsers.filter(u => u.role === 'admin' || u.role === 'superadmin');
    document.getElementById('stat-total-admins').textContent = admins.length;

    // Render Admins Table
    const adminTbody = document.getElementById('admin-list');
    adminTbody.innerHTML = admins.map(user => `
      <tr>
        <td style="color: white;">${user.firstName} ${user.lastName} ${user.role === 'superadmin' ? '<span style="background: #f5a623; color: #000; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 600;">SUPER</span>' : ''}</td>
        <td style="color: white;">${user.email}</td>
        <td>
          <span style="background: ${user.role === 'superadmin' ? 'rgba(245,166,35,0.15)' : 'rgba(102,126,234,0.15)'}; color: ${user.role === 'superadmin' ? '#f5a623' : '#667eea'}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
            ${user.role === 'superadmin' ? 'Super Admin' : 'Admin'}
          </span>
        </td>
        <td style="color: var(--text-secondary); font-size: 12px;">${user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
        <td>
          ${user.role !== 'superadmin' ? `
            <button class="btn-status" style="background: #e74c3c;" onclick="deleteAdmin('${user.id}')">
              <i class="fas fa-trash"></i> Remove
            </button>
          ` : '<span style="color: var(--text-muted); font-size: 11px;">—</span>'}
        </td>
      </tr>
    `).join('');

    // Render All Users Table
    const userTbody = document.getElementById('super-users-list');
    userTbody.innerHTML = allUsers.map(user => `
      <tr>
        <td style="color: white;">${user.firstName} ${user.lastName}</td>
        <td style="color: white;">${user.email}</td>
        <td>
          <select onchange="changeUserRole('${user.id}', this.value)" style="background: var(--bg-primary); color: white; border: 1px solid rgba(255,255,255,0.1); padding: 4px 8px; border-radius: var(--radius-sm); font-size: 12px;">
            <option value="customer" ${user.role === 'customer' ? 'selected' : ''}>Customer</option>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="superadmin" ${user.role === 'superadmin' ? 'selected' : ''}>Super Admin</option>
          </select>
        </td>
        <td style="color: var(--text-secondary); font-size: 12px;">${user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
        <td>
          <button class="btn-status" style="background: #e74c3c;" onclick="deleteUser('${user.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');

    // Render Products Table
    const products = await fetchProducts();
    const prodTbody = document.getElementById('super-products-list');
    if (products.length === 0) {
      prodTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px;">No products found.</td></tr>`;
    } else {
      prodTbody.innerHTML = products.map(p => `
        <tr>
          <td style="color: var(--text-muted); font-size: 12px;">${p.id}</td>
          <td style="color: white; font-weight: 500;">
            <a href="product-detail.html?id=${p.id}" style="color: white;">${p.name}</a>
          </td>
          <td style="color: var(--text-secondary);">${p.brand}</td>
          <td style="color: var(--text-secondary);">${p.category}</td>
          <td style="color: white; font-weight: 600;">${formatPrice(p.price)}</td>
          <td>
            <span style="color: ${p.inStock ? '#2ecc71' : '#e74c3c'};">
              ${p.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </td>
          <td>
            ${p.featured ? '<span style="color: #f5a623;"><i class="fas fa-star"></i></span>' : '<span style="color: var(--text-muted);">—</span>'}
          </td>
        </tr>
      `).join('');
    }

  } catch (err) {
    console.error('Super Admin Dashboard Error:', err);
  }
}

async function changeUserRole(userId, newRole) {
  if (!confirm(`Change this user's role to "${newRole}"?`)) return;
  try {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    });
    const data = await res.json();
    if (data.success) {
      Toast.show('User role updated successfully', 'success');
      renderSuperAdminDashboard();
    } else {
      Toast.show(data.message || 'Failed to update role', 'error');
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
}

window.deleteUser = async function(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Toast.show('User deleted successfully', 'success');
      renderSuperAdminDashboard();
    } else {
      Toast.show(data.message || 'Failed to delete user', 'error');
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
};

window.deleteAdmin = async function(userId) {
  if (!confirm('Remove this admin? Their account will be deleted.')) return;
  try {
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Toast.show('Admin removed successfully', 'success');
      renderSuperAdminDashboard();
    } else {
      Toast.show(data.message || 'Failed to remove admin', 'error');
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
};
