// ============================================================
// ShopFlow — Order History Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  
  if (!Auth.isLoggedIn()) {
    Toast.show('Please log in to view your orders', 'error');
    window.location.href = 'login.html';
    return;
  }
  
  renderOrders();
});

async function renderOrders() {
  const user = Auth.getCurrentUser();
  const userOrders = await Orders.getForUser(user.id);
  const container = document.getElementById('orders-container');
  
  if (userOrders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <i class="fas fa-box-open" style="font-size: 64px; color: var(--bg-elevated); margin-bottom: 20px;"></i>
        <h3 style="color: white; font-size: 22px; margin-bottom: 10px;">No Orders Yet</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">You haven't placed any orders yet.</p>
        <button class="btn-primary" onclick="window.location.href='products.html'">Start Shopping</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = userOrders.map(order => `
    <div class="order-card" onclick="toggleOrderDetails('${order.id}')">
      <div class="order-card-header">
        <div class="order-id"><i class="fas fa-receipt" style="color: var(--accent-purple); margin-right: 8px;"></i>${order.id}</div>
        <div class="order-status ${order.status.toLowerCase()}">${order.status}</div>
      </div>
      
      <div class="order-card-meta">
        <div><i class="far fa-calendar-alt"></i> ${formatDate(order.createdAt)}</div>
        <div><i class="fas fa-dollar-sign"></i> ${formatPrice(order.total)}</div>
        <div><i class="fas fa-box"></i> ${order.items.reduce((sum, i) => sum + i.quantity, 0)} Items</div>
        <div style="margin-left: auto; color: var(--accent-purple);"><i class="fas fa-chevron-down" id="icon-${order.id}"></i></div>
      </div>
      
      <div class="order-card-details" id="details-${order.id}">
        <h4 style="color: white; font-size: 14px; margin-bottom: 10px;">Items</h4>
        ${order.items.map(item => `
          <div class="order-detail-item">
            <div>
              <span style="color: white; font-weight: 500;">${item.name}</span>
              <span style="color: var(--text-muted); font-size: 11px; margin-left: 5px;">
                ${item.selectedColor ? item.selectedColor : ''} ${item.selectedStorage ? ` | ${item.selectedStorage}` : ''}
              </span>
              <span style="color: var(--text-muted); margin-left: 5px;">x${item.quantity}</span>
            </div>
            <div style="color: white;">${formatPrice(item.price * item.quantity)}</div>
          </div>
        `).join('')}
        
        <h4 style="color: white; font-size: 14px; margin: 15px 0 10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 15px;">Shipping Address</h4>
        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
          ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}<br>
          ${order.shippingInfo.address}<br>
          Phone: ${order.shippingInfo.phone}
        </div>
      </div>
    </div>
  `).join('');
}

window.toggleOrderDetails = function(orderId) {
  const details = document.getElementById(`details-${orderId}`);
  const icon = document.getElementById(`icon-${orderId}`);
  
  if (details.classList.contains('show')) {
    details.classList.remove('show');
    icon.classList.remove('fa-chevron-up');
    icon.classList.add('fa-chevron-down');
  } else {
    details.classList.add('show');
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
  }
};
