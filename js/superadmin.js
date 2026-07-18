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
          <div style="display:flex;gap:3px;flex-wrap:wrap;">
            <button class="btn-status" style="background:#e74c3c;padding:3px 6px;font-size:10px;min-width:28px;" onclick="addStock(${p.id}, -1)"><i class="fas fa-minus"></i></button>
            <button class="btn-status" style="background:#27ae60;padding:3px 6px;font-size:10px;min-width:28px;" onclick="addStock(${p.id}, 1)">+1</button>
            <button class="btn-status" style="background:#2ecc71;padding:3px 6px;font-size:10px;" onclick="addStock(${p.id}, 3)">+3</button>
            <button class="btn-status" style="background:#2ecc71;padding:3px 6px;font-size:10px;" onclick="addStock(${p.id}, 5)">+5</button>
            <button class="btn-status" style="background:#1abc9c;padding:3px 6px;font-size:10px;" onclick="addStock(${p.id}, 10)">+10</button>
            <button class="btn-status" style="background:#2d7d46;padding:3px 6px;font-size:10px;" onclick="addStock(${p.id}, 100)">+100</button>
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
      <td style="text-align:center;">${a.avatar ? `<img src="${a.avatar}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : '<div style="width:32px;height:32px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;margin:0 auto;"><i class="fas fa-user" style="color:var(--text-muted);font-size:14px;"></i></div>'}</td>
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

// ═══════════════════════════════════════════════
// PRODUCT MANAGEMENT (Super Admin)
// ═══════════════════════════════════════════════

let editingProductId = null;

// Color editor
let colorIndexCounter = 0;

window.addColorRow = function(data) {
  const container = document.getElementById('color-editor');
  if (!container) return;
  const idx = colorIndexCounter++;
  const name = data ? data.name : '';
  const hex = data ? data.hex : '#8b5cf6';
  const img = data ? (data.image || '') : '';
  const row = document.createElement('div');
  row.id = `color-row-${idx}`;
  row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap;padding:8px;background:var(--bg-tertiary);border-radius:6px;';
  row.innerHTML = `
    <input type="text" id="col-name-${idx}" class="modal-input" style="width:120px;" placeholder="Name" value="${name}">
    <input type="color" id="col-hex-${idx}" value="${hex}" style="width:36px;height:36px;border:none;border-radius:4px;cursor:pointer;background:none;padding:0;">
    <input type="text" id="col-img-${idx}" class="modal-input" style="width:180px;font-size:11px;" placeholder="Image URL (or upload)" value="${img}" readonly>
    <button type="button" class="btn-status" style="background:#4a90e2;padding:4px 8px;font-size:11px;" onclick="uploadColorImage(${idx})">
      <i class="fas fa-upload"></i>
    </button>
    <div id="col-preview-${idx}" style="${img ? 'display:block' : 'display:none'};width:32px;height:32px;border-radius:4px;overflow:hidden;">
      <img src="${img}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.display='none'">
    </div>
    <button type="button" class="btn-status" style="background:#e74c3c;padding:4px 8px;font-size:11px;" onclick="removeColorRow(${idx})">
      <i class="fas fa-times"></i>
    </button>
  `;
  container.appendChild(row);
};

window.removeColorRow = function(idx) {
  const row = document.getElementById(`color-row-${idx}`);
  if (row) row.remove();
};

window.uploadColorImage = async function(idx) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async function() {
    const file = this.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/products/upload-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        document.getElementById(`col-img-${idx}`).value = data.url;
        const preview = document.getElementById(`col-preview-${idx}`);
        preview.querySelector('img').src = data.url;
        preview.style.display = 'block';
        Toast.show('Color image uploaded', 'success');
      } else {
        Toast.show('Upload failed', 'error');
      }
    } catch (err) {
      Toast.show('Upload error', 'error');
    }
  };
  input.click();
};

function buildColorsFromEditor() {
  const container = document.getElementById('color-editor');
  if (!container) return [];
  const rows = container.querySelectorAll('[id^="color-row-"]');
  const colors = [];
  rows.forEach(row => {
    const id = row.id.replace('color-row-', '');
    const name = document.getElementById(`col-name-${id}`)?.value.trim();
    const hex = document.getElementById(`col-hex-${id}`)?.value;
    const img = document.getElementById(`col-img-${id}`)?.value.trim();
    if (name) {
      const c = { name, hex: hex || '#8b5cf6' };
      if (img) c.image = img;
      colors.push(c);
    }
  });
  return colors;
}

function populateColorEditor(colors) {
  const container = document.getElementById('color-editor');
  if (container) container.innerHTML = '';
  colorIndexCounter = 0;
  if (colors && colors.length > 0) {
    colors.forEach(c => addColorRow(c));
  }
}

async function renderSaProductsTable() {
  const tbody = document.getElementById('sa-products-list');
  if (!tbody) return;
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    tbody.innerHTML = products.map(p => `
      <tr>
        <td style="font-size:12px;color:var(--text-muted);">${p.id}</td>
        <td>
          ${p.image ? `<img src="${p.image}" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.display='none'">` : '<span style="color:var(--text-muted);font-size:18px;">📦</span>'}
        </td>
        <td style="color:white;font-size:13px;">${p.name}</td>
        <td style="font-size:12px;">${p.brand}</td>
        <td style="font-size:12px;">${p.category}</td>
        <td style="color:white;font-weight:600;">${formatPrice(p.price)}</td>
        <td style="color:${p.stock < 5 ? '#ff6b6b' : '#2ecc71'};font-weight:600;">${p.stock}</td>
        <td>
          <div style="display:flex;gap:4px;">
            <button class="btn-status" style="background:#4a90e2;" onclick="editSaProduct(${p.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-status" style="background:#e74c3c;" onclick="deleteSaProduct(${p.id})"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

window.showAddProductModal = function() {
  editingProductId = null;
  document.getElementById('product-modal-title').textContent = 'Add Product';
  document.getElementById('product-form').reset();
  document.getElementById('pf-instock').checked = true;
  document.getElementById('pf-stock').value = 10;
  document.getElementById('product-image-url').value = '';
  document.getElementById('product-image-preview').style.display = 'none';
  populateColorEditor([]);
  document.getElementById('product-modal').style.display = 'flex';
};

window.closeProductModal = function() {
  document.getElementById('product-modal').style.display = 'none';
};

window.editSaProduct = async function(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    const p = await res.json();
    editingProductId = id;
    document.getElementById('product-modal-title').textContent = 'Edit Product';
    document.getElementById('pf-name').value = p.name || '';
    document.getElementById('pf-brand').value = p.brand || '';
    document.getElementById('pf-category').value = p.category || '';
    document.getElementById('pf-section').value = p.section || '';
    document.getElementById('pf-price').value = p.price || '';
    document.getElementById('pf-original-price').value = p.originalPrice || '';
    document.getElementById('pf-discount').value = p.discount || 0;
    document.getElementById('pf-stock').value = p.stock || 0;
    document.getElementById('pf-description').value = p.description || '';
    document.getElementById('pf-specs').value = p.specs ? JSON.stringify(p.specs, null, 2) : '';
    populateColorEditor(p.colors);
    document.getElementById('pf-featured').checked = p.featured || false;
    document.getElementById('pf-instock').checked = p.inStock !== false;
    if (p.image) {
      document.getElementById('product-image-url').value = p.image;
      const preview = document.getElementById('product-image-preview');
      preview.querySelector('img').src = p.image;
      preview.style.display = 'block';
    }
    document.getElementById('product-modal').style.display = 'flex';
  } catch (err) {
    Toast.show('Failed to load product', 'error');
  }
};

window.deleteSaProduct = async function(id) {
  if (!confirm('Delete this product? This cannot be undone.')) return;
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Toast.show('Product deleted', 'success');
      renderSaProductsTable();
      loadStock();
    } else {
      Toast.show('Failed to delete', 'error');
    }
  } catch (err) {
    Toast.show('Network error', 'error');
  }
};

// Load products on dashboard init
const origSaLoad = loadSuperAdminDashboard;
loadSuperAdminDashboard = function() {
  origSaLoad.call(this);
  renderSaProductsTable();
};

// Handle image upload
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('product-image-input');
  if (fileInput) {
    fileInput.addEventListener('change', async function() {
      const file = this.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch('/api/products/upload-image', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          document.getElementById('product-image-url').value = data.url;
          const preview = document.getElementById('product-image-preview');
          preview.querySelector('img').src = data.url;
          preview.style.display = 'block';
          Toast.show('Image uploaded', 'success');
        } else {
          Toast.show('Upload failed', 'error');
        }
      } catch (err) {
        Toast.show('Upload error', 'error');
      }
    });
  }
});

// Form submit handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const data = {
        name: document.getElementById('pf-name').value.trim(),
        brand: document.getElementById('pf-brand').value.trim(),
        category: document.getElementById('pf-category').value,
        price: parseFloat(document.getElementById('pf-price').value),
        originalPrice: parseFloat(document.getElementById('pf-original-price').value) || null,
        discount: parseFloat(document.getElementById('pf-discount').value) || 0,
        description: document.getElementById('pf-description').value.trim(),
        stock: parseInt(document.getElementById('pf-stock').value) || 0,
        featured: document.getElementById('pf-featured').checked,
        inStock: document.getElementById('pf-instock').checked,
        section: document.getElementById('pf-section').value || null,
        image: document.getElementById('product-image-url').value || 'assets/placeholder.svg',
        rating: 0,
        reviews: 0
      };

      try {
        data.specs = document.getElementById('pf-specs').value.trim() ? JSON.parse(document.getElementById('pf-specs').value) : {};
      } catch(e) {
        Toast.show('Invalid specs JSON format', 'error');
        return;
      }

      data.colors = buildColorsFromEditor();

      if (!data.name || !data.brand || !data.category || !data.price) {
        Toast.show('Please fill in required fields', 'error');
        return;
      }

      try {
        const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
        const method = editingProductId ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
          Toast.show(editingProductId ? 'Product updated' : 'Product created', 'success');
          closeProductModal();
          renderSaProductsTable();
          loadStock();
        } else {
          Toast.show(result.message || 'Failed to save', 'error');
        }
      } catch (err) {
        Toast.show('Network error', 'error');
      }
    });
  }
});

// ═══════════════════════════════════════════════
// SEARCH / FILTER
// ═══════════════════════════════════════════════

window.filterSaProducts = function() {
  const q = (document.getElementById('sa-product-search').value || '').toLowerCase().replace(/\s/g, '');
  const rows = document.querySelectorAll('#sa-products-list tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase().replace(/\s/g, '');
    row.style.display = text.includes(q) ? '' : 'none';
  });
};

window.filterSaApprovals = function() {
  const q = (document.getElementById('sa-approval-search').value || '').toLowerCase().replace(/\s/g, '');
  const rows = document.querySelectorAll('#sa-approvals-list tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase().replace(/\s/g, '');
    row.style.display = text.includes(q) ? '' : 'none';
  });
};

window.filterSaStock = function() {
  const q = (document.getElementById('sa-stock-search').value || '').toLowerCase().replace(/\s/g, '');
  const rows = document.querySelectorAll('#sa-stock-list tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase().replace(/\s/g, '');
    row.style.display = text.includes(q) ? '' : 'none';
  });
};
