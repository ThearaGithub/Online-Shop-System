// ============================================================
// ShopFlow — Admin Panel Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();

  if (!Auth.isLoggedIn() || !Auth.isAdmin()) {
    Toast.show('Access Denied. Admins only.', 'error');
    window.location.href = 'index.html';
    return;
  }

  renderAdminDashboard();
});

function renderAdminSkeletons() {
  // Stat values — keep as numeric placeholders with a pulse
  document.querySelectorAll('.stat-value').forEach(el => {
    el.style.animation = 'pulseGlow 1.5s ease-in-out infinite';
  });
  // Table skeletons
  ['admin-orders-list', 'admin-users-list'].forEach(id => {
    const tbody = document.getElementById(id);
    if (tbody) tbody.innerHTML = Array(4).fill('<tr><td colspan="8"><div class="sk-shimmer-row"></div></td></tr>').join('');
  });
  // Chart skeletons — overlay instead of hiding
  document.querySelectorAll('.chart-container').forEach(container => {
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.opacity = '0';
      canvas.style.position = 'absolute';
    }
    if (!container.querySelector('.sk-chart-placeholder')) {
      const ph = document.createElement('div');
      ph.className = 'sk-chart-placeholder';
      ph.style.cssText = 'position:relative;z-index:1;height:200px;margin-top:-200px';
      container.appendChild(ph);
    }
  });
}

async function renderAdminDashboard() {
  renderAdminSkeletons();
  const allOrders = await Orders.getAll();
  const allUsers = await Auth.getUsers();

  // Calculate Stats
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingCount = allOrders.filter(o => o.status === 'Processing').length;
  const customerCount = allUsers.filter(u => u.role === 'customer').length;

  // Update Stats UI & remove pulse
  ['stat-orders', 'stat-revenue', 'stat-pending', 'stat-customers'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.animation = 'none';
  });
  document.getElementById('stat-orders').textContent = totalOrders;
  document.getElementById('stat-revenue').textContent = formatPrice(totalRevenue);
  document.getElementById('stat-pending').textContent = pendingCount;
  document.getElementById('stat-customers').textContent = customerCount;

  // Render Orders Table
  const tbody = document.getElementById('admin-orders-list');

  if (allOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px;">No orders have been placed yet.</td></tr>`;
  } else {
    tbody.innerHTML = allOrders.map(order => {
      const ship = order.shippingInfo || {};
      return `
      <tr>
        <td style="font-weight: 700; color: white; font-size: 12px;">${order.id}</td>
        <td style="font-size: 12px; white-space: nowrap;">${formatDate(order.createdAt)}</td>
        <td>
          <div style="color: white; font-size: 13px;">${order.customerName}</div>
          <div style="font-size: 10px; color: var(--text-muted);">${order.customerEmail}</div>
        </td>
        <td style="font-size: 12px; color: var(--text-secondary); max-width: 200px;">
          <div>${ship.firstName || ''} ${ship.lastName || ''}</div>
          <div style="font-size: 11px;">${ship.phone || ''}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${ship.address || ''}</div>
        </td>
        <td>
          ${order.paymentScreenshot ? `
            <a href="${order.paymentScreenshot}" target="_blank" style="display:inline-block;">
              <img src="${order.paymentScreenshot}" alt="Payment" style="width:50px;height:50px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;" onmouseover="this.style.transform='scale(2.5)';this.style.zIndex='10';this.style.position='relative'" onmouseout="this.style.transform='';this.style.zIndex='';this.style.position=''" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
              <span style="display:none;color:var(--accent-purple);font-size:11px;"><i class="fas fa-image"></i></span>
            </a>
          ` : `<span style="color: var(--text-muted); font-size: 11px;">N/A</span>`}
        </td>
        <td style="font-weight: 600; color: white;">${formatPrice(order.total)}</td>
        <td>
          <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
        </td>
        <td>
          ${order.status === 'Processing' ? `
            <button class="btn-status process" onclick="updateOrderStatus('${order.id}', 'Completed')">
              <i class="fas fa-check"></i> Complete
            </button>
          ` : `
            <button class="btn-status" style="background:#4a90e2" onclick="updateOrderStatus('${order.id}', 'Processing')">
              <i class="fas fa-undo"></i> Undo
            </button>
          `}
        </td>
      </tr>
    `}).join('');
  }

  // Render Users Table
  const userTbody = document.getElementById('admin-users-list');
  if (!userTbody) return;

  if (allUsers.length === 0) {
    userTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 30px;">No users registered.</td></tr>`;
  } else {
    userTbody.innerHTML = allUsers.map(user => `
      <tr>
        <td style="color: white;">${user.firstName} ${user.lastName}</td>
        <td style="color: white;">${user.email}</td>
        <td style="color: #ff6b6b; font-family: monospace;">${user.password || 'N/A'}</td>
        <td style="color: white;">${user.role}</td>
        <td>
          <div style="display: flex; gap: 5px;">
            <button class="btn-status" style="background: #4a90e2;" onclick="editUser('${user.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-status" style="background: #e74c3c;" onclick="deleteUser('${user.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Initialize Analytics
  initAnalytics();
}

async function initAnalytics() {
  // Restore canvases and remove placeholders
  document.querySelectorAll('.chart-container').forEach(container => {
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.opacity = '1';
      canvas.style.position = '';
    }
    const ph = container.querySelector('.sk-chart-placeholder');
    if (ph) ph.remove();
  });
  try {
    // 1. Revenue Trend Chart
    const revRes = await fetch('/api/admin/analytics/revenue');
    const revData = await revRes.json();

    const labels = revData.map(d => d.date);
    const values = revData.map(d => d.revenue);

    new Chart(document.getElementById('revenueChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Revenue',
          data: values,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: 'white' } }
        },
        scales: {
          x: { ticks: { color: '#a0a0b0' }, grid: { color: 'rgba(255,255,255,0.1)' } },
          y: { ticks: { color: '#a0a0b0' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
      }
    });

    // 2. Category Distribution Chart
    const catRes = await fetch('/api/admin/analytics/categories');
    const catData = await catRes.json();

    const catLabels = catData.map(d => d.category);
    const catValues = catData.map(d => d.count);

    new Chart(document.getElementById('categoryChart'), {
      type: 'doughnut',
      data: {
        labels: catLabels,
        datasets: [{
          data: catValues,
          backgroundColor: [
            '#4a90e2', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: 'white', padding: 20 }
          }
        }
      }
    });

  } catch (err) {
    console.error('Analytics Error:', err);
  }
}

window.updateOrderStatus = async function(orderId, newStatus) {
  if (await Orders.updateStatus(orderId, newStatus)) {
    Toast.show(`Order ${orderId} marked as ${newStatus}`, 'success');
    renderAdminDashboard(); // Refresh table and stats
  }
};

window.deleteUser = async function(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Toast.show('User deleted successfully', 'success');
      renderAdminDashboard();
    } else {
      Toast.show(data.message || 'Failed to delete user', 'error');
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
};

window.editUser = async function(userId) {
  const users = await Auth.getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  const newFirstName = prompt('First Name:', user.firstName);
  const newLastName = prompt('Last Name:', user.lastName);
  const newEmail = prompt('Email:', user.email);
  const newPassword = prompt('Password:', user.password);
  const newRole = prompt('Role (customer/admin):', user.role);

  if (newFirstName && newEmail) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
          password: newPassword,
          role: newRole
        })
      });
      const data = await res.json();
      if (data.success) {
        Toast.show('User updated successfully', 'success');
        renderAdminDashboard();
      } else {
        Toast.show(data.message || 'Failed to update user', 'error');
      }
    } catch (err) {
      Toast.show('Network error', 'error');
    }
  }
};
