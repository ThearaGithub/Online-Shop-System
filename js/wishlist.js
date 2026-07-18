document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderWishlist();
});

function renderWishlist() {
  const items = Wishlist.getItems();
  const container = document.getElementById('wishlist-items');
  const countEl = document.getElementById('wishlist-count');

  countEl.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-heart" style="font-size:48px;color:var(--text-muted);margin-bottom:15px;"></i>
        <h3 style="color:white;">Your wishlist is empty</h3>
        <p style="color:var(--text-secondary);">Save products you love for later!</p>
        <a href="products.html" class="btn-primary" style="display:inline-block;margin-top:15px;">Browse Products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item" data-product-id="${item.productId}">
      <div style="display:flex;gap:12px;align-items:center;">
        <div style="width:80px;height:80px;background:var(--bg-elevated);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:contain;border-radius:6px;" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-mobile-alt\\' style=\\'font-size:32px;color:var(--text-muted);\\'></i>'">
        </div>
        <div style="flex:1;min-width:0;">
          <a href="product-detail.html?id=${item.productId}" style="color:white;font-weight:600;font-size:14px;text-decoration:none;">${item.name}</a>
          <div style="color:var(--text-secondary);font-size:12px;margin-top:2px;">${item.brand}</div>
          <div style="color:var(--accent-purple);font-weight:700;font-size:15px;margin-top:4px;">${formatPrice(item.price)}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-shrink:0;">
        <button class="btn-primary" style="padding:8px 14px;font-size:12px;" onclick="addToCartFromWishlist(${item.productId})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
        <button class="btn-status" style="background:#e74c3c;padding:8px 12px;font-size:12px;" onclick="removeFromWishlist(${item.productId})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');
}

window.addToCartFromWishlist = async function(productId) {
  const product = await getProductById(productId);
  if (!product) { Toast.show('Product not found', 'error'); return; }
  Cart.addItem(product);
  Toast.show('Added to cart!', 'success');
};

window.removeFromWishlist = function(productId) {
  Wishlist.removeItem(productId);
  renderWishlist();
  Toast.show('Removed from Wishlist', 'info');
};