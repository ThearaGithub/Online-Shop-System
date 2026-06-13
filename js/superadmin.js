let currentPeriod = 'all';
let brandChart = null;
let salesChart = null;
let productChart = null;

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  if (!Auth.isLoggedIn() || Auth.getCurrentUser().role !== 'superadmin') {
    Toast.show('Access Denied. Super Admins only.', 'error');
    window.location.href = 'index.html';
    return;
  }
  loadSuperAdminDashboard();
});

async function loadSuperAdminDashboard() {
  // Load orders & users for stats
  const allOrders = await Orders.getAll();
  const allUsers = await Auth.getUsers();
  const admins = allUsers.filter(u => u.role === 'admin');

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const productsSold = allOrders.reduce((sum, o) => sum + (o.items || []).reduce((s, i) => s + i.quantity, 0), 0);

  document.getElementById('sa-total-orders').textContent = totalOrders;
  document.getElementById('sa-total-revenue').textContent = formatPrice(totalRevenue);
  document.getElementById('sa-products-sold').textContent = productsSold;
  document.getElementById('sa-total-admins').textContent = admins.length;

  // Load analytics with period
  await loadAnalytics(currentPeriod);

  // Load stock
  await loadStock();

  // Load admin accounts
  renderAdmins(admins);

  // Load approval log
  await loadApprovals();
}

async function loadAnalytics(period) {
  try {
    const res = await fetch(`/api/admin/analytics/summary?period=${period}`);
    const data = await res.json();
    document.getElementById('sa-period-sold').textContent = data.productsSold || 0;
    document.getElementById('sa-period-revenue').textContent = formatPrice(data.revenue || 0);
    const avgOrder = data.orderCount > 0 ? data.revenue / data.orderCount : 0;
    document.getElementById('sa-avg-order').textContent = formatPrice(avgOrder);

    const periodName = period === 'all' ? '(all time)' : `(${period})`;
    document.getElementById('sa-period-sold-label').textContent = periodName;
    document.getElementById('sa-period-rev-label').textContent = periodName;

    updateCharts(data);
  } catch (err) {
    console.error('Analytics error:', err);
  }
}

function updateCharts(data) {
  const brands = data.salesByBrand || [];
  const labels = brands.map(b => b.brand);
  const revenues = brands.map(b => parseFloat(b.revenue));
  const counts = brands.map(b => parseInt(b.count));

  // Revenue by brand
  const revCtx = document.getElementById('saBrandChart');
  if (brandChart) brandChart.destroy();
  brandChart = new Chart(revCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data: revenues,
        backgroundColor: '#8b5cf6',
        borderRadius: 4
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

  // Sales count by brand
  const salesCtx = document.getElementById('saSalesChart');
  if (salesChart) salesChart.destroy();
  salesChart = new Chart(salesCtx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: ['#8b5cf6', '#4a90e2', '#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: 'white', padding: 15 } }
      }
    }
  });

  // Products sold bar chart
  const prodCtx = document.getElementById('saProductChart');
  if (productChart) productChart.destroy();
  const prod = data.salesByProduct || [];
  const prodLabels = prod.map(d => d.name.length > 20 ? d.name.slice(0, 20) + '…' : d.name);
  const prodValues = prod.map(d => parseFloat(d.revenue));
  const prodCounts = prod.map(d => parseInt(d.count));
  const prodColors = ['#8b5cf6','#4a90e2','#e74c3c','#f1c40f','#2ecc71','#e67e22','#9b59b6','#1abc9c','#3498db','#e84393'];
  productChart = new Chart(prodCtx, {
    type: 'bar',
    data: {
      labels: prodLabels,
      datasets: [{
        label: 'Revenue',
        data: prodValues,
        backgroundColor: prodLabels.map((_, i) => prodColors[i % prodColors.length]),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              const idx = context.dataIndex;
              return `Units sold: ${prodCounts[idx]}`;
            }
          }
        }
      },
      scales: {
        x: { ticks: { color: '#a0a0b0', callback: v => '$' + v.toFixed(0) }, grid: { color: 'rgba(255,255,255,0.1)' } },
        y: { ticks: { color: '#a0a0b0', font: { size: 10 } }, grid: { display: false } }
      }
    }
  });
}

async function loadStock() {
  try {
    const res = await fetch('/api/admin/stock');
    const products = await res.json();
    const tbody = document.getElementById('sa-stock-list');
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:30px;">No products found.</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(p => `
      <tr>
        <td style="color:white;font-weight:600;">${p.name}</td>
        <td>${p.brand}</td>
        <td>${p.category}</td>
        <td>${formatPrice(p.price)}</td>
        <td>
          <span style="color:${p.stock < 10 ? '#ff6b6b' : p.stock < 30 ? '#f1c40f' : '#2ecc71'};font-weight:700;">
            ${p.stock}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:4px;flex-wrap:nowrap;">
            <button class="btn-status" style="background:#e74c3c;padding:4px 8px;font-size:11px;min-width:32px;" onclick="addStock(${p.id}, -1)"><i class="fas fa-minus"></i></button>
            <button class="btn-status" style="background:#27ae60;padding:4px 8px;font-size:11px;min-width:32px;" onclick="addStock(${p.id}, 1)"><i class="fas fa-plus"></i></button>
            <button class="btn-status" style="background:#2d7d46;padding:4px 10px;font-size:11px;" onclick="addStock(${p.id}, 100)">
              <i class="fas fa-plus"></i> +100
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Stock error:', err);
  }
}

function renderAdmins(admins) {
  const tbody = document.getElementById('sa-admins-list');
  if (admins.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;">No admins found.</td></tr>';
    return;
  }
  tbody.innerHTML = admins.map(a => `
    <tr>
      <td style="color:white;">${a.firstName} ${a.lastName}</td>
      <td style="color:white;">${a.email}</td>
      <td><span class="order-status admin">${a.role}</span></td>
      <td>
        <button class="btn-status" style="background:#4a90e2;" onclick="editAdmin('${a.id}')">
          <i class="fas fa-edit"></i> Edit
        </button>
      </td>
    </tr>
  `).join('');
}

window.editAdmin = async function(userId) {
  const allUsers = await Auth.getUsers();
  const user = allUsers.find(u => u.id === userId);
  if (!user) return;
  const newFirstName = prompt('First Name:', user.firstName);
  const newLastName = prompt('Last Name:', user.lastName);
  const newEmail = prompt('Email:', user.email);
  const newPassword = prompt('Password:', user.password);
  if (newFirstName && newEmail) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: newFirstName, lastName: newLastName, email: newEmail, password: newPassword, role: user.role })
      });
      const data = await res.json();
      if (data.success) {
        Toast.show('Admin updated', 'success');
        loadSuperAdminDashboard();
      }
    } catch (err) {
      Toast.show('Network error', 'error');
    }
  }
};

async function loadApprovals() {
  try {
    const res = await fetch('/api/superadmin/approvals');
    const approvals = await res.json();
    const tbody = document.getElementById('sa-approvals-list');
    if (approvals.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:30px;">No orders yet.</td></tr>';
      return;
    }
    tbody.innerHTML = approvals.map(a => `
      <tr>
        <td style="font-weight:700;color:white;font-size:12px;">${a.id}</td>
        <td style="color:white;">${a.customerName || a.userName || 'N/A'}</td>
        <td style="font-size:12px;">
          ${(a.items || []).map(item => `
            <div style="white-space:nowrap;color:var(--text-secondary);">
              <span style="color:white;">${item.name}</span> <span style="color:var(--text-muted);">×${item.quantity}</span>
            </div>
          `).join('')}
        </td>
        <td style="font-weight:600;color:white;">${formatPrice(a.total)}</td>
        <td><span class="order-status ${a.status.toLowerCase()}">${a.status}</span></td>
        <td>
          ${a.paymentScreenshot ? `
            <a href="${a.paymentScreenshot}" target="_blank">
              <img src="${a.paymentScreenshot}" alt="Payment" style="width:50px;height:50px;object-fit:cover;border-radius:6px;border:1px solid rgba(255,255,255,0.1);transition:transform 0.2s;cursor:pointer;" onmouseover="this.style.transform='scale(2.5)';this.style.zIndex='10';this.style.position='relative'" onmouseout="this.style.transform='';this.style.zIndex='';this.style.position=''" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
              <span style="display:none;color:var(--accent-purple);font-size:11px;"><i class="fas fa-image"></i></span>
            </a>
          ` : '<span style="color:var(--text-muted);font-size:11px;">—</span>'}
        </td>
        <td style="color:${a.approvedBy ? 'var(--accent-purple)' : 'var(--text-muted)'};font-size:12px;">${a.approverName || a.approvedBy || '—'}</td>
        <td style="font-size:12px;">${formatDate(a.createdAt)}</td>
        ${a.status === 'Completed' ? `
        <td style="display:flex;gap:4px;flex-wrap:nowrap;">
          <button class="btn-status" style="background:#e74c3c;padding:4px 8px;font-size:11px;" onclick="disapproveOrder('${a.id}')">
            <i class="fas fa-times"></i> Disapprove
          </button>
          <button class="btn-status" style="background:#c0392b;padding:4px 8px;font-size:11px;" onclick="deleteSaOrder('${a.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>` : `
        <td style="display:flex;gap:4px;flex-wrap:nowrap;">
          <span style="color:var(--text-muted);font-size:11px;line-height:28px;">Pending</span>
          <button class="btn-status" style="background:#c0392b;padding:4px 8px;font-size:11px;margin-left:4px;" onclick="deleteSaOrder('${a.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>`}
      </tr>
    `).join('');
  } catch (err) {
    console.error('Approvals error:', err);
  }
}

window.disapproveOrder = async function(orderId) {
  if (!confirm(`Disapprove order ${orderId}? This will revert it back to "Processing" and restore stock.`)) return;
  try {
    const res = await fetch(`/api/superadmin/approvals/${orderId}/disapprove`, { method: 'PUT' });
    const data = await res.json();
    if (data.success) {
      Toast.show(`Order ${orderId} disapproved — reverted to Processing`, 'success');
      loadSuperAdminDashboard();
    } else {
      Toast.show(data.message || 'Failed to disapprove', 'error');
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
};

window.deleteSaOrder = async function(orderId) {
  if (!confirm(`Delete order ${orderId}? This cannot be undone. Stock will be restored.`)) return;
  try {
    const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Toast.show(`Order ${orderId} deleted`, 'success');
      loadSuperAdminDashboard();
    } else {
      Toast.show(data.message || 'Failed to delete order', 'error');
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
};

window.addStock = async function(productId, amount) {
  try {
    const res = await fetch(`/api/admin/stock/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    const data = await res.json();
    if (data.success) {
      Toast.show(`+${amount} stock added`, 'success');
      loadStock();
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
};

window.setPeriod = function(period) {
  currentPeriod = period;
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === period);
  });
  loadAnalytics(period);
};
