// ============================================================
// ShopFlow — Admin Panel Logic
// ============================================================

let currentPeriod = 'all';

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();

  const user = Auth.getCurrentUser();
  if (!Auth.isLoggedIn() || (user.role !== 'admin' && user.role !== 'superadmin')) {
    Toast.show('Access Denied. Admins only.', 'error');
    window.location.href = 'index.html';
    return;
  }

  // Show Super Admin link if user is superadmin
  if (Auth.isSuperAdmin()) {
    const titleBar = document.querySelector('.page-title-bar');
    if (titleBar) {
      const link = document.createElement('a');
      link.href = 'superadmin.html';
      link.style.cssText = 'display: inline-block; margin-left: 15px; background: #f5a623; color: #000; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; text-decoration: none;';
      link.innerHTML = '<i class="fas fa-crown"></i> Super Admin';
      titleBar.querySelector('h1').after(link);
    }
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
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 30px;">No orders have been placed yet.</td></tr>`;
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
        <td style="font-size: 12px; color: var(--text-secondary);">
          ${(order.items || []).map(item => `
            <div style="white-space: nowrap; margin-bottom: 2px;">
              <span style="color: white;">${item.name}</span>
              <span style="color: var(--text-muted);"> ×${item.quantity}</span>
              ${item.selectedColor ? `<span style="color: var(--accent-purple); font-size: 10px;"> (${item.selectedColor})</span>` : ''}
              ${item.selectedStorage ? `<span style="color: var(--accent-purple); font-size: 10px;"> ${item.selectedStorage}</span>` : ''}
            </div>
          `).join('') || '<span style="color: var(--text-muted);">N/A</span>'}
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
          <div style="display:flex;gap:4px;flex-wrap:nowrap;">
          ${order.status === 'Processing' ? `
            <button class="btn-status process" onclick="updateOrderStatus('${order.id}', 'Completed')">
              <i class="fas fa-check"></i> Complete
            </button>
          ` : `
            <button class="btn-status" style="background:#4a90e2" onclick="updateOrderStatus('${order.id}', 'Processing')">
              <i class="fas fa-undo"></i> Undo
            </button>
          `}
            <button class="btn-status" style="background:#e74c3c;" onclick="deleteOrder('${order.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
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

async function initAnalytics(period) {
  period = period || 'all';
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
    // Load period summary
    const summaryRes = await fetch(`/api/admin/analytics/summary?period=${period}`);
    const summary = await summaryRes.json();
    document.getElementById('admin-period-sold').textContent = summary.productsSold || 0;
    document.getElementById('admin-period-revenue').textContent = formatPrice(summary.revenue || 0);
    const avgOrder = summary.orderCount > 0 ? summary.revenue / summary.orderCount : 0;
    document.getElementById('admin-avg-order').textContent = formatPrice(avgOrder);

    const periodName = period === 'all' ? '(all time)' : `(${period})`;
    document.getElementById('admin-period-sold-label').textContent = periodName;
    document.getElementById('admin-period-rev-label').textContent = periodName;

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
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: 'white', padding: 20 }
          }
        }
      }
    });

    // 3. Products Sold Bar Chart
    const prodLabels = summary.salesByProduct ? summary.salesByProduct.map(d => d.name.length > 20 ? d.name.slice(0, 20) + '…' : d.name) : [];
    const prodValues = summary.salesByProduct ? summary.salesByProduct.map(d => parseInt(d.count)) : [];

    const prodColors = ['#8b5cf6','#4a90e2','#e74c3c','#f1c40f','#2ecc71','#e67e22','#9b59b6','#1abc9c','#3498db','#e84393'];
    new Chart(document.getElementById('adminProductChart'), {
      type: 'bar',
      data: {
        labels: prodLabels,
        datasets: [{
          label: 'Units Sold',
          data: prodValues,
          backgroundColor: prodLabels.map((_, i) => prodColors[i % prodColors.length]),
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#a0a0b0', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.1)' } },
          y: { ticks: { color: '#a0a0b0', font: { size: 10 } }, grid: { display: false } }
        }
      }
    });

  } catch (err) {
    console.error('Analytics Error:', err);
  }
}

window.updateOrderStatus = async function(orderId, newStatus) {
  // Get admin email directly from localStorage
  let adminId;
  try {
    const userData = localStorage.getItem('genzshop_current_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed && parsed.email) adminId = parsed.email;
    }
  } catch(e) {}
  if (!adminId) {
    const user = Auth.getCurrentUser();
    adminId = user ? user.email : undefined;
  }
  console.log('[ADMIN] Completing order with adminId:', adminId);
  if (await Orders.updateStatus(orderId, newStatus, adminId)) {
    Toast.show(`Order ${orderId} marked as ${newStatus}`, 'success');
    renderAdminDashboard();
  }
};

window.deleteOrder = async function(orderId) {
  if (!confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
  if (await Orders.deleteOrder(orderId)) {
    Toast.show(`Order ${orderId} deleted`, 'success');
    renderAdminDashboard();
  } else {
    Toast.show('Failed to delete order', 'error');
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
    } catch(e) {
      Toast.show('Network error', 'error');
    }
  }
};

window.setPeriod = function(period) {
  currentPeriod = period;
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === period);
  });
  initAnalytics(period);
};
