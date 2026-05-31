// ============================================================
// ShopFlow — Cart Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderCart();
});

function renderCart() {
  const items = Cart.getItems();
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-basket"></i>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button class="btn-primary" onclick="window.location.href='products.html'">Start Shopping</button>
      </div>
    `;
    summary.style.display = 'none';
    return;
  }
  
  summary.style.display = 'block';
  
  // Render Items
  container.innerHTML = `<h2>Cart Items (${Cart.getCount()})</h2>` + items.map(item => `
    <div class="cart-item">
      <a href="product-detail.html?id=${item.productId}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}" class="product-img" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'product-emoji\\'>📦</span>'">
        </div>
      </a>
      <div class="cart-item-details">
        <a href="product-detail.html?id=${item.productId}" style="text-decoration: none;">
          <div class="cart-item-name">${item.name}</div>
        </a>
        <div class="cart-item-brand">${item.brand}</div>
        ${item.selectedColor || item.selectedStorage ? `
          <div class="cart-item-options">
            ${item.selectedColor ? `Color: ${item.selectedColor}` : ''} 
            ${item.selectedColor && item.selectedStorage ? '|' : ''} 
            ${item.selectedStorage ? `Storage: ${item.selectedStorage}` : ''}
          </div>
        ` : ''}
      </div>
      
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateCartItemQty(${item.productId}, -1, '${item.selectedColor || ''}', '${item.selectedStorage || ''}')">-</button>
        <input type="number" class="qty-value" value="${item.quantity}" readonly>
        <button class="qty-btn" onclick="updateCartItemQty(${item.productId}, 1, '${item.selectedColor || ''}', '${item.selectedStorage || ''}')">+</button>
      </div>
      
      <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
      
      <button class="cart-item-remove" onclick="removeCartItem(${item.productId}, '${item.selectedColor || ''}', '${item.selectedStorage || ''}')">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');
  
  updateSummary();
}

function updateSummary() {
  const subtotal = Cart.getSubtotal();
  const tax = Cart.getTax();
  const shipping = Cart.getShipping();
  const total = subtotal + tax + shipping;
  
  document.getElementById('summary-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('summary-tax').textContent = formatPrice(tax);
  document.getElementById('summary-shipping').innerHTML = shipping === 0 ? '<span class="free">Free</span>' : formatPrice(shipping);
  document.getElementById('summary-total').textContent = formatPrice(total);
}

// Global functions for inline HTML handlers
window.updateCartItemQty = function(productId, change, color, storage) {
  const c = color === '' ? null : color;
  const s = storage === '' ? null : storage;
  
  const items = Cart.getItems();
  const item = items.find(i => 
    i.productId === productId && 
    i.selectedColor === c && 
    i.selectedStorage === s
  );
  
  if (item) {
    const newQty = item.quantity + change;
    if (newQty > 0) {
      Cart.updateQuantity(productId, newQty, c, s);
      renderCart(); // Re-render to update UI
    } else {
      // Prompt before removing if quantity drops to 0
      if (confirm('Remove this item from your cart?')) {
        removeCartItem(productId, color, storage);
      }
    }
  }
};

window.removeCartItem = function(productId, color, storage) {
  const c = color === '' ? null : color;
  const s = storage === '' ? null : storage;
  Cart.removeItem(productId, c, s);
  Toast.show('Item removed from cart', 'info');
  renderCart();
};

window.proceedToCheckout = function() {
  if (!Auth.isLoggedIn()) {
    const msg = document.getElementById('checkout-msg');
    msg.textContent = 'Please log in to proceed to checkout.';
    msg.classList.add('show');
    
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }
  
  window.location.href = 'checkout.html';
};
