// ============================================================
// ShopFlow — Product Detail Logic
// ============================================================

let currentProduct = null;
let selectedColor = null;
let selectedStorage = null;
let currentQuantity = 1;

function renderDetailSkeleton() {
  const container = document.getElementById('detail-container');
  if (!container) return;
  container.innerHTML = `
    <div class="detail-skeleton">
      <div class="detail-skeleton-left">
        <div class="sk-img"></div>
        <div class="sk-thumbs">
          <div class="sk-thumb"></div>
          <div class="sk-thumb"></div>
          <div class="sk-thumb"></div>
        </div>
      </div>
      <div class="detail-skeleton-right">
        <div class="sk-line w40 h2"></div>
        <div class="sk-line w100 h3"></div>
        <div class="sk-line w60"></div>
        <div class="sk-price"></div>
        <div class="sk-line w100"></div>
        <div class="sk-line w100"></div>
        <div class="sk-line w80"></div>
        <div style="display:flex;gap:10px;margin:15px 0;">
          <div class="sk-line" style="width:48px;height:48px;border-radius:50%;"></div>
          <div class="sk-line" style="width:48px;height:48px;border-radius:50%;"></div>
          <div class="sk-line" style="width:48px;height:48px;border-radius:50%;"></div>
        </div>
        <div class="sk-btn"></div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  
  const productId = getUrlParam('id');
  if (!productId) {
    window.location.href = 'products.html';
    return;
  }
  
  renderDetailSkeleton();
  
  currentProduct = await getProductById(productId);
  if (!currentProduct) {
    document.getElementById('detail-container').innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 100px 20px;">
        <h2 style="color: white; margin-bottom: 10px;">Product Not Found</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">The product you're looking for doesn't exist or has been removed.</p>
        <a href="products.html" class="btn-primary">Return to Shop</a>
      </div>
    `;
    return;
  }
  
  // Initialize defaults
  if (currentProduct.colors && currentProduct.colors.length > 0) {
    selectedColor = currentProduct.colors[0];
  }
  if (currentProduct.specs && currentProduct.specs.storage && Array.isArray(currentProduct.specs.storage) && currentProduct.specs.storage[0] && currentProduct.specs.storage[0] !== '—') {
    selectedStorage = currentProduct.specs.storage[0];
  }
  
  const allProducts = await fetchProducts();
  
  renderProductDetail();
  renderSpecs();
  renderRelatedProducts(allProducts);
  renderReviews();
});

function renderProductDetail() {
  const p = currentProduct;
  const hasDiscount = p.discount > 0 && p.originalPrice;
  
  // Breadcrumb
  document.getElementById('detail-breadcrumb').innerHTML = `
    <a href="index.html">Home</a> <span>/</span> 
    <a href="products.html?category=${encodeURIComponent(p.category)}">${p.category}</a> <span>/</span> 
    <span style="color: white;">${p.name}</span>
  `;
  
  // HTML Structure matching the UI design
  const html = `
    <!-- Left: Gallery -->
    <div class="image-gallery">
      <div class="main-image">
        ${hasDiscount ? `<div class="discount-badge">$${p.discount} Off</div>` : ''}
        <img src="${selectedColor && selectedColor.image ? selectedColor.image : p.image}" alt="${p.name}" class="detail-product-img" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span class=\\'product-emoji\\'>📦</span>')">
      </div>
      <div class="thumb-gallery">
        ${p.colors && p.colors.length > 0 && p.colors[0].image ? p.colors.map((c, i) => `
          <div class="thumb-item ${selectedColor.name === c.name ? 'active' : ''}" onclick="selectColor(${i})">
            <img src="${c.image}" alt="${c.name}" class="thumb-img">
          </div>
        `).join('') : `
          <div class="thumb-item active"><img src="${selectedColor && selectedColor.image ? selectedColor.image : p.image}" alt="${p.name}" class="thumb-img"></div>
          <div class="thumb-item"><img src="${p.image}" alt="${p.name}" class="thumb-img"></div>
          <div class="thumb-item"><img src="${p.image}" alt="${p.name}" class="thumb-img"></div>
          <div class="thumb-item"><img src="${p.image}" alt="${p.name}" class="thumb-img"></div>
        `}
      </div>
    </div>
    
    <!-- Right: Info -->
    <div class="product-info">
      <div class="brand-tags">
        <span class="brand-tag">${p.brand}</span>
        <span class="brand-tag"><i class="fas fa-check-circle" style="color:var(--color-success)"></i> Official Warranty</span>
      </div>
      
      <h1 class="detail-product-name">${p.name}</h1>
      
      <div style="margin-bottom:8px;display:flex;align-items:center;gap:8px;"><span class="stars">${p.reviews > 0 ? renderStars(p.rating) : '<i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>'}</span>${p.reviews > 0 ? `<span style="color:var(--text-secondary);font-size:13px;">${p.rating.toFixed(1)} (${p.reviews} ${p.reviews === 1 ? 'review' : 'reviews'})</span>` : '<span style="color:var(--text-muted);font-size:12px;">No reviews yet</span>'}</div>
      
      <div style="margin-bottom: 15px;">
        <span class="detail-price">${formatPrice(p.price)}</span>
        ${hasDiscount ? `<span class="detail-original-price">${formatPrice(p.originalPrice)}</span>` : ''}
        ${p.price >= 100 ? `<div class="detail-installment" style="margin-top:5px;">Up to 12 months installment: <strong>${formatPrice(p.price/12)}/mo.</strong></div>` : ''}
        ${p.stock > 0 ? `<div style="margin-top:6px;font-size:13px;color:${p.stock < 5 ? '#ff6b6b' : p.stock < 15 ? '#f1c40f' : '#2ecc71'};"><i class="fas fa-box"></i> ${p.stock} left in stock</div>` : '<div style="margin-top:6px;font-size:13px;color:#ff6b6b;"><i class="fas fa-times-circle"></i> Out of stock</div>'}
      </div>
      
      <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
        ${p.description}
      </p>
      
      <!-- Quick Specs -->
      <div class="quick-specs" style="margin-bottom: 25px;">
        ${p.specs && p.specs.display && p.specs.display !== '—' ? `
          <div class="quick-spec">
            <div class="spec-icon"><i class="fas fa-mobile-alt"></i></div>
            <div class="spec-value">${p.specs.display.split(',')[0]}</div>
            <div class="spec-label">Display</div>
          </div>
        ` : ''}
        ${p.specs && p.specs.processor && p.specs.processor !== '—' ? `
          <div class="quick-spec">
            <div class="spec-icon"><i class="fas fa-microchip"></i></div>
            <div class="spec-value">${p.specs.processor.split(' ')[0]}</div>
            <div class="spec-label">Chipset</div>
          </div>
        ` : ''}
        ${p.specs && p.specs.battery && p.specs.battery !== '—' ? `
          <div class="quick-spec">
            <div class="spec-icon"><i class="fas fa-battery-full"></i></div>
            <div class="spec-value">${p.specs.battery.split(' ')[0]}</div>
            <div class="spec-label">Battery</div>
          </div>
        ` : ''}
      </div>
      
      <!-- Options -->
      ${p.colors && p.colors.length > 0 ? `
        <div class="option-section" style="margin-bottom: 20px;">
          <div class="option-label">Color: <span style="color:white; font-weight:400;" id="color-label">${selectedColor.name}</span></div>
          <div class="color-options">
            ${p.colors.map((c, i) => `
              <div class="color-btn ${selectedColor.name === c.name ? 'active' : ''}" onclick="selectColor(${i})">
                <div class="color-swatch" style="background-color: ${c.hex};"></div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${p.specs && p.specs.storage && Array.isArray(p.specs.storage) && p.specs.storage[0] && p.specs.storage[0] !== '—' ? `
        <div class="option-section" style="margin-bottom: 25px;">
          <div class="option-label">Storage</div>
          <div class="option-buttons">
            ${p.specs.storage.map(s => `
              <button class="option-btn ${selectedStorage === s ? 'active' : ''}" onclick="selectStorage('${s}')">${s}</button>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- Add to Cart -->
      <div class="cart-row">
        ${p.inStock ? `
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQty(-1)">-</button>
            <input type="number" class="qty-value" id="qty-input" value="1" min="1" readonly>
            <button class="qty-btn" onclick="updateQty(1)">+</button>
          </div>
          <button class="btn-add-to-cart-detail" onclick="addCurrentToCart()">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn-wishlist-detail" onclick="toggleWishlistDetail()" title="Wishlist">
            <i class="fa${Wishlist.isInWishlist(p.id) ? 's' : 'r'} fa-heart"></i>
          </button>
          <div style="color:var(--color-success);font-size:12px;margin-left:10px;"><i class="fas fa-check-circle"></i> In Stock</div>
        ` : `
          <div style="color:#ff6b6b;font-size:14px;font-weight:700;padding:16px 0;"><i class="fas fa-times-circle"></i> Sold Out</div>
        `}
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px; color: var(--text-secondary); display: flex; gap: 20px;">
        <div><i class="fas fa-truck" style="color:var(--text-muted); margin-right:5px;"></i> Fast Delivery</div>
        <div><i class="fas fa-undo" style="color:var(--text-muted); margin-right:5px;"></i> 7-Day Return</div>
        <div><i class="fas fa-shield-alt" style="color:var(--text-muted); margin-right:5px;"></i> 1 Year Warranty</div>
      </div>
    </div>
  `;
  
  document.getElementById('detail-container').innerHTML = html;
}

function renderSpecs() {
  const p = currentProduct;
  document.getElementById('specs-container').style.display = 'block';
  
  const specsHtml = `
    <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
      <div class="spec-card">
        <div class="spec-card-title">Performance</div>
        <div class="spec-row"><div class="spec-key">Processor</div><div class="spec-value-text">${p.specs && p.specs.processor ? p.specs.processor : '—'}</div></div>
        <div class="spec-row"><div class="spec-key">RAM</div><div class="spec-value-text">${p.specs && p.specs.ram ? p.specs.ram : '—'}</div></div>
      </div>
      <div class="spec-card">
        <div class="spec-card-title">Storage & Software</div>
        <div class="spec-row"><div class="spec-key">Storage</div><div class="spec-value-text">${p.specs && p.specs.storage ? (Array.isArray(p.specs.storage) ? p.specs.storage.join(', ') : p.specs.storage) : '—'}</div></div>
        <div class="spec-row"><div class="spec-key">OS</div><div class="spec-value-text">${p.specs && p.specs.os ? p.specs.os : '—'}</div></div>
        <div class="spec-row"><div class="spec-key">Cloud</div><div class="spec-value-text">Seamless Sync Supported</div></div>
      </div>
      <div class="spec-card">
        <div class="spec-card-title">Display</div>
        <div class="spec-row"><div class="spec-key">Screen</div><div class="spec-value-text">${p.specs && p.specs.display ? p.specs.display : '—'}</div></div>
        <div class="spec-row"><div class="spec-key">Refresh Rate</div><div class="spec-value-text">Up to 120Hz Adaptive</div></div>
      </div>
      <div class="spec-card">
        <div class="spec-card-title">Camera System</div>
        <div class="spec-row"><div class="spec-key">Main Camera</div><div class="spec-value-text">${p.specs && p.specs.camera ? p.specs.camera : '—'}</div></div>
        <div class="spec-row"><div class="spec-key">Video</div><div class="spec-value-text">4K@60fps HDR, 1080p@240fps</div></div>
        <div class="spec-row"><div class="spec-key">Front Camera</div><div class="spec-value-text">Ultra-wide Lens with Auto-focus</div></div>
      </div>
      <div class="spec-card">
        <div class="spec-card-title">Power & Battery</div>
        <div class="spec-row"><div class="spec-key">Battery</div><div class="spec-value-text">${p.specs && p.specs.battery ? p.specs.battery : '—'}</div></div>
        <div class="spec-row"><div class="spec-key">Charging</div><div class="spec-value-text">Fast Charging & Wireless Supported</div></div>
        <div class="spec-row"><div class="spec-key">Port</div><div class="spec-value-text">USB Type-C</div></div>
      </div>
      <div class="spec-card">
        <div class="spec-card-title">Build & Connectivity</div>
        <div class="spec-row"><div class="spec-key">Connectivity</div><div class="spec-value-text">5G, Wi-Fi 6E/7, Bluetooth 5.3</div></div>
        <div class="spec-row"><div class="spec-key">Resistance</div><div class="spec-value-text">IP68 Dust/Water Resistant</div></div>
        <div class="spec-row"><div class="spec-key">Weight</div><div class="spec-value-text">${p.specs && p.specs.weight ? p.specs.weight : '—'}</div></div>
      </div>
    </div>
  `;
  
  document.getElementById('specs-content').innerHTML = specsHtml;
}

function renderRelatedProducts(allProducts) {
  const p = currentProduct;
  const related = allProducts.filter(prod => 
    prod.id !== p.id && 
    (prod.category === p.category || prod.brand === p.brand)
  ).slice(0, 4);
  
  if (related.length > 0) {
    document.getElementById('related-container').style.display = 'block';
    document.getElementById('related-products-grid').innerHTML = related.map(prod => createProductCard(prod)).join('');
    addRevealToGrid('#related-products-grid');
  }
}

// Global UI handlers
window.selectColor = function(index) {
  selectedColor = currentProduct.colors[index];
  renderProductDetail(); // Re-render to update active classes
};

window.selectStorage = function(storage) {
  selectedStorage = storage;
  renderProductDetail();
};

window.updateQty = function(change) {
  currentQuantity += change;
  if (currentQuantity < 1) currentQuantity = 1;
  document.getElementById('qty-input').value = currentQuantity;
};

window.addCurrentToCart = function() {
  if (!currentProduct || !currentProduct.inStock) {
    Toast.show('This product is sold out!', 'error');
    return;
  }
  const cartItems = Cart.getItems();
  const inCart = cartItems.find(i => i.productId === currentProduct.id);
  const cartQty = inCart ? inCart.quantity : 0;
  const totalWanted = cartQty + currentQuantity;
  if (totalWanted > currentProduct.stock) {
    Toast.show(`Only ${currentProduct.stock} available, you have ${cartQty} in cart!`, 'error');
    return;
  }
  Cart.addItem(
    currentProduct, 
    currentQuantity, 
    selectedColor ? selectedColor.name : null, 
    selectedStorage
  );
  Toast.show(`${currentQuantity}x ${currentProduct.name} added to cart!`, 'success');
};

window.toggleWishlistDetail = function() {
  if (!currentProduct) return;
  const added = Wishlist.toggle(currentProduct);
  const btn = document.querySelector('.btn-wishlist-detail i');
  if (btn) btn.className = added ? 'fas fa-heart' : 'far fa-heart';
  Toast.show(added ? 'Added to Wishlist' : 'Removed from Wishlist', added ? 'success' : 'info');
};

// ─── REVIEWS ────────────────────────────────────────────────
let currentReviews = [];
let editingReviewId = null;

function renderStarsInput(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += `<i class="fas fa-star star-picker ${i <= rating ? 'active' : ''}" data-val="${i}" onclick="setReviewRating(${i})"></i>`;
  }
  return s;
}

function renderStarsDisplay(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += `<i class="fas fa-star ${i <= rating ? 'active' : ''}" style="font-size:13px;"></i>`;
  }
  return s;
}

let reviewRating = 5;
window.setReviewRating = function(val) { reviewRating = val; renderReviewForm(); renderNewReviewForm(); };

async function renderReviews() {
  const container = document.getElementById('reviews-container');
  const content = document.getElementById('reviews-content');
  if (!container || !content) return;
  
  try {
    const res = await fetch(`/api/products/${currentProduct.id}/reviews`);
    currentReviews = await res.json();
  } catch(e) {
    currentReviews = [];
  }
  
  const user = Auth.getCurrentUser();
  const userReview = user ? currentReviews.find(r => r.userId === user.id) : null;
  
  // Auto-enter edit mode if user has a review
  if (userReview && !editingReviewId) {
    editingReviewId = userReview.id;
    reviewRating = userReview.rating;
  }
  
  container.style.display = 'block';
  content.innerHTML = `
    ${user ? `
      <div class="review-form-card" id="review-form-container" style="display:${editingReviewId ? 'block' : 'none'};">
        <h4 style="margin-bottom:10px;color:white;">Edit Your Review</h4>
        <div class="review-stars-input" id="review-stars">${renderStarsInput(reviewRating)}</div>
        <textarea id="review-comment" placeholder="Share your thoughts about this product..." rows="3">${userReview ? userReview.comment : ''}</textarea>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn-primary" style="padding:8px 16px;font-size:13px;" onclick="submitReview()">Edit</button>
          <button class="btn-status" style="background:#555;padding:8px 16px;font-size:13px;" onclick="cancelReviewEdit()">Cancel</button>
        </div>
      </div>
      ${!userReview ? `
      <div class="review-form-card" id="new-review-form">
        <h4 style="margin-bottom:10px;color:white;">Write a Review</h4>
        <div class="review-stars-input" id="new-review-stars">${renderStarsInput(5)}</div>
        <textarea id="new-review-comment" placeholder="Share your thoughts about this product..." rows="3"></textarea>
        <div style="display:flex;gap:8px;margin-top:8px;">
          <button class="btn-primary" style="padding:8px 16px;font-size:13px;" onclick="submitNewReview()">Submit</button>
        </div>
      </div>
      ` : ''}
    ` : `
      <p style="color:var(--text-secondary);margin-bottom:15px;"><a href="login.html" style="color:var(--accent-purple);">Log in</a> to write a review.</p>
    `}
    <div class="reviews-list" id="reviews-list">
      ${currentReviews.length === 0 ? '<p style="color:var(--text-muted);font-size:14px;">No reviews yet. Be the first!</p>' : ''}
      ${currentReviews.map(r => `
        <div class="review-card">
          <div class="review-header">
            <div class="review-author">
              ${r.avatar ? `<img src="${r.avatar}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">` : `<i class="fas fa-user-circle" style="font-size:32px;color:var(--text-muted);"></i>`}
              <div>
                <strong style="color:white;font-size:14px;">${r.userName}</strong>
                <div style="font-size:11px;color:var(--text-muted);">${formatDate(r.createdAt)}${r.updatedAt !== r.createdAt ? ' (edited)' : ''}</div>
              </div>
            </div>
            <div style="color:var(--accent-purple);display:flex;align-items:center;gap:8px;">
              ${renderStarsDisplay(r.rating)}
              ${user && r.userId === user.id ? `
                <div style="display:flex;gap:4px;margin-left:8px;">
                  <button class="btn-status" style="background:#4a90e2;padding:4px 8px;font-size:11px;" onclick="setEditReview(${r.id})"><i class="fas fa-edit"></i></button>
                  <button class="btn-status" style="background:#e74c3c;padding:4px 8px;font-size:11px;" onclick="deleteReview(${r.id})"><i class="fas fa-trash"></i></button>
                </div>
              ` : ''}
            </div>
          </div>
          ${r.comment ? `<p class="review-text">${r.comment}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  renderReviewForm();
}

function renderReviewForm() {
  const starsContainer = document.getElementById('review-stars');
  if (starsContainer) starsContainer.innerHTML = renderStarsInput(reviewRating);
}

function renderNewReviewForm() {
  const starsContainer = document.getElementById('new-review-stars');
  if (starsContainer) starsContainer.innerHTML = renderStarsInput(reviewRating);
}

window.submitReview = async function() {
  const user = Auth.getCurrentUser();
  if (!user) { Toast.show('Please log in first', 'error'); return; }
  const comment = document.getElementById('review-comment').value.trim();
  if (!comment) { Toast.show('Please write a comment', 'error'); return; }
  
  try {
    if (editingReviewId) {
      const res = await fetch(`/api/reviews/${editingReviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment })
      });
      const data = await res.json();
      if (data.success) {
        Toast.show('Review updated', 'success');
        editingReviewId = null;
        document.getElementById('review-form-container').style.display = 'none';
        renderReviews();
        // Refresh product data to get new rating
        currentProduct = await getProductById(currentProduct.id);
        renderProductDetail();
      }
    } else {
      const res = await fetch(`/api/products/${currentProduct.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userName: user.firstName + ' ' + (user.lastName || ''), avatar: user.avatar || null, rating: reviewRating, comment })
      });
      const data = await res.json();
      if (data.success) {
        Toast.show('Review submitted', 'success');
        reviewRating = 5;
        renderReviews();
        currentProduct = await getProductById(currentProduct.id);
        renderProductDetail();
      }
    }
  } catch(e) {
    Toast.show('Failed to submit review', 'error');
  }
};

window.setEditReview = function(id) {
  const review = currentReviews.find(r => r.id === id);
  if (!review) return;
  editingReviewId = id;
  reviewRating = review.rating;
  document.getElementById('review-form-container').style.display = 'block';
  document.getElementById('review-comment').value = review.comment;
  renderReviewForm();
  document.getElementById('review-form-container').scrollIntoView({ behavior: 'smooth', block: 'center' });
};

window.cancelReviewEdit = function() {
  editingReviewId = null;
  reviewRating = 5;
  renderReviews();
};

window.submitNewReview = async function() {
  const user = Auth.getCurrentUser();
  if (!user) { Toast.show('Please log in first', 'error'); return; }
  const comment = document.getElementById('new-review-comment').value.trim();
  if (!comment) { Toast.show('Please write a comment', 'error'); return; }
  const rating = reviewRating; // uses the global from star clicks
  try {
    const res = await fetch(`/api/products/${currentProduct.id}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, userName: user.firstName + ' ' + (user.lastName || ''), avatar: user.avatar || null, rating, comment })
    });
    const data = await res.json();
    if (data.success) {
      Toast.show('Review submitted', 'success');
      reviewRating = 5;
      document.getElementById('new-review-form').style.display = 'none';
      renderReviews();
      currentProduct = await getProductById(currentProduct.id);
      renderProductDetail();
      renderSpecs();
    } else {
      Toast.show('Failed to submit', 'error');
    }
  } catch(e) {
    Toast.show('Network error', 'error');
  }
};

window.deleteReview = async function(id) {
  if (!confirm('Delete your review?')) return;
  try {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      Toast.show('Review deleted', 'success');
      reviewRating = 5;
      renderReviews();
      currentProduct = await getProductById(currentProduct.id);
      renderProductDetail();
    }
  } catch(e) {
    Toast.show('Failed to delete review', 'error');
  }
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
