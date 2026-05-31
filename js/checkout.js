// ============================================================
// ShopFlow — Checkout Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  
  // Security Checks
  if (!Auth.isLoggedIn()) {
    Toast.show('Please log in to checkout', 'error');
    window.location.href = 'login.html';
    return;
  }
  
  if (Cart.getCount() === 0) {
    Toast.show('Your cart is empty', 'warning');
    window.location.href = 'cart.html';
    return;
  }
  
  // Init page data
  initCheckout();
});

function initCheckout() {
  const user = Auth.getCurrentUser();
  
  // Pre-fill user data
  document.getElementById('firstName').value = user.firstName;
  document.getElementById('lastName').value = user.lastName;
  document.getElementById('email').value = user.email;
  
  // Render Summary Sidebar
  renderCheckoutSummary();
  
  // Handle File Upload visual feedback
  const fileInput = document.getElementById('payment-proof');
  const uploadBtn = document.getElementById('upload-btn');
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      uploadBtn.innerHTML = `<i class="fas fa-check-circle"></i> ${fileName}`;
      uploadBtn.classList.add('uploaded');
    } else {
      uploadBtn.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> Click to Upload Screenshot`;
      uploadBtn.classList.remove('uploaded');
    }
  });
  
  // Handle Form Submit
  document.getElementById('checkout-form').addEventListener('submit', handleCheckoutSubmit);
}

function renderCheckoutSummary() {
  const items = Cart.getItems();
  const itemsContainer = document.getElementById('checkout-items');
  
  itemsContainer.innerHTML = items.map(item => `
    <div style="display: flex; gap: 10px; margin-bottom: 12px; font-size: 13px;">
      <div style="width: 40px; height: 40px; background: var(--bg-elevated); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
        <img src="${item.image}" alt="${item.name}" class="product-img" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'product-emoji\\'>📦</span>'">
      </div>
      <div style="flex: 1;">
        <div style="color: white; font-weight: 600;">${item.name} <span style="color: var(--text-muted)">x${item.quantity}</span></div>
        <div style="color: var(--text-secondary); font-size: 11px;">
          ${item.selectedColor ? item.selectedColor : ''} ${item.selectedStorage ? ` | ${item.selectedStorage}` : ''}
        </div>
      </div>
      <div style="color: white; font-weight: 700;">
        ${formatPrice(item.price * item.quantity)}
      </div>
    </div>
  `).join('');
  
  // Update totals
  const subtotal = Cart.getSubtotal();
  const tax = Cart.getTax();
  const shipping = Cart.getShipping();
  const total = subtotal + tax + shipping;
  
  document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('summary-tax').textContent = formatPrice(tax);
  document.getElementById('summary-shipping').innerHTML = shipping === 0 ? '<span class="free">Free</span>' : formatPrice(shipping);
  document.getElementById('summary-total').textContent = formatPrice(total);
}

function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  // Verify payment proof
  const fileInput = document.getElementById('payment-proof');
  const errorDiv = document.getElementById('checkout-error');
  
  if (fileInput.files.length === 0) {
    errorDiv.textContent = 'Please upload your payment screenshot.';
    errorDiv.classList.add('show');
    return;
  }
  
  const btn = document.getElementById('btn-place-order');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Order...';
  errorDiv.classList.remove('show');
  
  // Gather Shipping Info
  const shippingInfo = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim()
  };
  
  // Upload screenshot & place order
  setTimeout(async () => {
    const paymentFile = fileInput.files[0];
    
    const result = await Orders.placeOrder(shippingInfo, paymentFile);
    
    if (result.success) {
      window.location.href = `order-confirmation.html?id=${result.order.id}`;
    } else {
      errorDiv.textContent = result.message;
      errorDiv.classList.add('show');
      btn.disabled = false;
      btn.textContent = 'Place Order';
    }
  }, 1500);
}
