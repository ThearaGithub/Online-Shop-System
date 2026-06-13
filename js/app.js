// ============================================================
// ShopFlow — Core Application Module
// Auth, Cart, Orders, UI Utilities
// ============================================================

// ─── STORAGE KEYS ────────────────────────────────────────────
const STORAGE = {
  USERS: 'genzshop_users',
  CURRENT_USER: 'genzshop_current_user',
  CART: 'genzshop_cart',
  ORDERS: 'genzshop_orders'
};

// ─── INITIALIZATION ──────────────────────────────────────────
(function initApp() {
  if (!localStorage.getItem(STORAGE.USERS)) {
    const defaultUsers = [
      {
        id: 'admin-001',
        firstName: 'Admin',
        lastName: 'GenZ',
        email: 'admin@genzshop.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE.CART)) {
    localStorage.setItem(STORAGE.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE.ORDERS)) {
    localStorage.setItem(STORAGE.ORDERS, JSON.stringify([]));
  }
})();

// ─── AUTH SYSTEM ─────────────────────────────────────────────
const Auth = {
  async getUsers() {
    try {
      const res = await fetch('/api/admin/users');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getCurrentUser() {
    const data = localStorage.getItem(STORAGE.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'super_admin');
  },

  isSuperAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'super_admin';
  },

  async signup(firstName, lastName, email, password) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(STORAGE.CURRENT_USER, JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem(STORAGE.CURRENT_USER, JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  logout() {
    localStorage.removeItem(STORAGE.CURRENT_USER);
  },

  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) return false;
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return false;
    Object.assign(users[idx], updates);
    localStorage.setItem(STORAGE.USERS, JSON.stringify(users));
    const { password: _, ...safeUser } = users[idx];
    localStorage.setItem(STORAGE.CURRENT_USER, JSON.stringify(safeUser));
    return true;
  }
};

// ─── CART SYSTEM ─────────────────────────────────────────────
const Cart = {
  getItems() {
    return JSON.parse(localStorage.getItem(STORAGE.CART) || '[]');
  },

  save(items) {
    localStorage.setItem(STORAGE.CART, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(product, quantity = 1, selectedColor = null, selectedStorage = null) {
    const items = this.getItems();
    const existing = items.find(item =>
      item.productId === product.id &&
      item.selectedColor === selectedColor &&
      item.selectedStorage === selectedStorage
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity,
        selectedColor,
        selectedStorage
      });
    }
    this.save(items);
    return items;
  },

  removeItem(productId, selectedColor = null, selectedStorage = null) {
    let items = this.getItems();
    items = items.filter(item =>
      !(item.productId === productId &&
        item.selectedColor === selectedColor &&
        item.selectedStorage === selectedStorage)
    );
    this.save(items);
    return items;
  },

  updateQuantity(productId, quantity, selectedColor = null, selectedStorage = null) {
    const items = this.getItems();
    const item = items.find(i =>
      i.productId === productId &&
      i.selectedColor === selectedColor &&
      i.selectedStorage === selectedStorage
    );
    if (item) {
      item.quantity = Math.max(1, quantity);
    }
    this.save(items);
    return items;
  },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTax() {
    return this.getSubtotal() * 0.10; // 10% tax
  },

  getShipping() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 500 ? 0 : 9.99; // Free shipping over $500
  },

  getTotal() {
    return this.getSubtotal() + this.getTax() + this.getShipping();
  },

  clear() {
    this.save([]);
  },

  updateBadge() {
    document.querySelectorAll('.cart-count-badge').forEach(el => {
      const count = this.getCount();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ─── ORDER SYSTEM ────────────────────────────────────────────
const Orders = {
  async getAll() {
    try {
      const res = await fetch('/api/orders');
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async getForUser(userId) {
    try {
      const res = await fetch(`/api/orders?userId=${userId}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async getById(orderId) {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch (err) {
      return null;
    }
  },

  async placeOrder(shippingInfo, paymentFile = null) {
    const user = Auth.getCurrentUser();
    if (!user) return { success: false, message: 'Please log in to place an order.' };

    const items = Cart.getItems();
    if (items.length === 0) return { success: false, message: 'Your cart is empty.' };

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('customerName', `${user.firstName} ${user.lastName}`);
    formData.append('customerEmail', user.email);
    formData.append('subtotal', Cart.getSubtotal());
    formData.append('tax', Cart.getTax());
    formData.append('shipping', Cart.getShipping());
    formData.append('total', Cart.getTotal());
    formData.append('shippingInfo', JSON.stringify(shippingInfo));
    formData.append('items', JSON.stringify(items));
    if (paymentFile) formData.append('paymentScreenshot', paymentFile);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        Cart.clear();
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  async updateStatus(orderId, status, adminId) {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminId })
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  async deleteOrder(orderId) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};

// ─── TOAST NOTIFICATIONS ─────────────────────────────────────
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed; top: 80px; right: 20px; z-index: 10000;
        display: flex; flex-direction: column; gap: 10px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 3000) {
    this.init();
    const toast = document.createElement('div');
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    const colors = {
      success: 'linear-gradient(135deg, #28a745, #20c997)',
      error: 'linear-gradient(135deg, #dc3545, #e74c3c)',
      warning: 'linear-gradient(135deg, #ffc107, #f5a623)',
      info: 'linear-gradient(135deg, #667eea, #764ba2)'
    };
    toast.style.cssText = `
      background: ${colors[type] || colors.info};
      color: white; padding: 14px 24px; border-radius: 12px;
      font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3); pointer-events: auto;
      animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-family: 'Inter', sans-serif; min-width: 250px; max-width: 400px;
    `;
    toast.innerHTML = `<span style="font-size:18px">${icons[type] || icons.info}</span> ${message}`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ─── SHARED HEADER RENDERER ──────────────────────────────────
function renderHeader() {
  const user = Auth.getCurrentUser();
  const cartCount = Cart.getCount();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    {
      label: 'Product',
      href: 'products.html',
      icon: 'fa-chevron-down',
      dropdown: [
        { label: 'All Phones', href: 'products.html' },
        { label: 'Latest Models', href: 'products.html?section=new-arrival' },
        { label: 'Best Sellers', href: 'products.html?sort=popular' },
        { label: 'All Brands', href: 'products.html' },
      ]
    },
    {
      label: 'Accessories',
      href: 'products.html?category=Accessories',
      icon: 'fa-chevron-down',
      dropdown: [
        { label: 'Phone Cases', href: 'products.html?category=Accessories&search=case' },
        { label: 'Chargers', href: 'products.html?category=Accessories&search=charger' },
        { label: 'Headphones', href: 'products.html?category=Accessories&search=headphone' },
        { label: 'Screen Protectors', href: 'products.html?category=Accessories&search=protector' },
      ]
    },
    {
      label: 'SecondHand',
      href: 'products.html?category=SecondHand',
      icon: 'fa-chevron-down',
      dropdown: [
        { label: 'Grade A (Like New)', href: 'products.html?category=SecondHand&search=Grade+A' },
        { label: 'Grade B (Good)', href: 'products.html?category=SecondHand&search=Grade+B' },
        { label: 'Budget Options', href: 'products.html?category=SecondHand&sort=price-asc' },
      ]
    },
    {
      label: 'Special Offer',
      href: 'products.html?filter=deals',
      icon: 'fa-chevron-down',
      dropdown: [
        { label: 'Daily Deals', href: 'products.html?filter=deals' },
        { label: 'Flash Sales', href: 'products.html?filter=deals&search=flash' },
        { label: 'Bundle Offers', href: 'products.html?filter=deals&search=bundle' },
      ]
    },
    { label: 'New Arrival', href: 'products.html?section=new-arrival', icon: '' },
    { label: 'Contact Us', href: 'contact.html', icon: '' }
  ];

  const headerHTML = `
    <header class="header" id="main-header">
      <div class="header-container">
        <a href="index.html" class="logo" id="logo-link">
          <img src="assets/ShopFlow Logo.png" alt="ShopFlow">
        </a>
        <div class="search-bar" id="global-search">
          <input type="text" placeholder="Search products..." id="search-input" autocomplete="off">
          <button id="search-btn"><i class="fas fa-search"></i> Search</button>
        </div>
        <div class="header-icons">
          <div class="theme-toggle" id="theme-toggle" title="Toggle theme" onclick="toggleTheme()">
            <i class="fas fa-moon"></i>
            <i class="fas fa-sun"></i>
            <div class="theme-toggle-knob"></div>
          </div>
          <a href="cart.html" class="icon-btn" id="cart-icon" title="Shopping Cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count-badge" style="display:${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
          </a>
          ${user ? `
            <div class="user-account" id="user-menu-toggle">
              <div class="user-avatar"><i class="fas fa-user"></i></div>
              <div class="user-info">
                <strong>${user.firstName}</strong>
                <span class="user-role">${user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'My Account'}</span>
              </div>
              <i class="fas fa-chevron-down" style="font-size:10px;color:#a0a0b0"></i>
            </div>
            <div class="user-dropdown" id="user-dropdown">
              <a href="orders.html"><i class="fas fa-box"></i> My Orders</a>
              ${user.role === 'super_admin' ? '<a href="super-admin.html"><i class="fas fa-crown"></i> Super Admin Panel</a>' : ''}
              ${user.role === 'admin' || user.role === 'super_admin' ? '<a href="admin.html"><i class="fas fa-cog"></i> Admin Panel</a>' : ''}
              <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Log Out</a>
            </div>
          ` : `
            <a href="login.html" class="user-account" id="login-link">
              <div class="user-avatar"><i class="fas fa-user"></i></div>
              <div class="user-info">
                <strong>My Account</strong>
                <span class="user-role">Register or Login</span>
              </div>
            </a>
          `}
        </div>
        <button class="mobile-menu-btn" id="mobile-menu-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>
      <nav class="nav-menu" id="nav-menu">
        <div class="nav-container">
          ${navItems.map(item => `
            <div class="nav-item-container">
              <a href="${item.href}" class="nav-item ${currentPage === item.href.split('?')[0] ? 'active' : ''}">
                ${item.label} ${item.icon ? `<i class="fas ${item.icon}"></i>` : ''}
              </a>
              ${item.dropdown ? `
                <div class="nav-dropdown">
                  ${item.dropdown.map(sub => `
                    <a href="${sub.href}">${sub.label}</a>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </nav>
    </header>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  let lastScrollY = window.scrollY;
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  if (searchInput && searchBtn) {
    const doSearch = () => {
      const q = searchInput.value.trim();
      if (!q) return;
      const currentPage = window.location.pathname.split('/').pop();
      if (currentPage === 'products.html') {
        const params = new URLSearchParams(window.location.search);
        params.set('search', q);
        window.location.href = `products.html?${params.toString()}`;
      } else {
        window.location.href = `products.html?search=${encodeURIComponent(q)}`;
      }
    };
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') doSearch(); });
  }

  const toggle = document.getElementById('user-menu-toggle');
  const dropdown = document.getElementById('user-dropdown');
  if (toggle && dropdown) {
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => dropdown.classList.remove('show'));
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      Auth.logout();
      Toast.show('Logged out successfully.', 'info');
      setTimeout(() => window.location.href = 'index.html', 500);
    });
  }

  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => navMenu.classList.toggle('open'));
  }

  Cart.updateBadge();
}

function renderFooter() {
  const footerHTML = `
    <footer class="footer" id="main-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="logo-icon"><i class="fas fa-shopping-bag"></i></div>
            <span>ShopFlow</span>
          </div>
          <p class="footer-desc">Your trusted destination for the latest smartphones, smartwatches, and tech accessories. Quality products, competitive prices.</p>
          <div class="footer-social">
            <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="https://t.me/Domzin168" target="_blank" aria-label="Telegram" style="color: #24A1DE;"><i class="fab fa-telegram"></i></a>
            <a href="#" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
          </div>
        </div>
        <div class="footer-links-group">
          <h4>Quick Links</h4>
          <a href="index.html">Home</a>
          <a href="products.html">All Products</a>
          <a href="products.html?filter=deals">Special Offers</a>
          <a href="contact.html">Contact Us</a>
        </div>
        <div class="footer-links-group">
          <h4>Categories</h4>
          <a href="products.html?category=Mobile+Phone">Mobile Phones</a>
          <a href="products.html?category=Smart+Watch">Smart Watches</a>
          <a href="products.html?category=Accessories">Accessories</a>
          <a href="products.html?category=SecondHand">SecondHand</a>
        </div>
        <div class="footer-links-group">
          <h4>Support</h4>
          <a href="https://t.me/Domzin168" target="_blank">Telegram Support</a>
          <a href="orders.html">Track Order</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 ShopFlow. All rights reserved. | Academic Project — Group 3</p>
      </div>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// ─── SCROLL REVEAL OBSERVER ─────────────────────────────────────
let revealObserver;

function observeReveal(elements) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }
  elements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
}

function addRevealToGrid(gridSelector) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;
  const cards = grid.querySelectorAll('.category-card, .brand-item');
  cards.forEach((card, i) => {
    card.style.setProperty('--reveal-delay', `${i * 0.06}s`);
  });
  observeReveal(cards);
  // Product cards just fade in without stagger to keep hover snappy
  const productCards = grid.querySelectorAll('.product-card');
  productCards.forEach((card, i) => {
    card.style.animation = `fadeIn 0.5s ease both`;
    card.style.animationDelay = `${i * 0.05}s`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  observeReveal(document.querySelectorAll(
    '.hero-carousel, .section-header, .categories-grid, .admin-page, .auth-container, .contact-page, .page-title-bar'
  ));
});

// ─── UTILITY FUNCTIONS ───────────────────────────────────────
function formatPrice(price) {
  return '$' + price.toFixed(2);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('API not available');
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return data;
    throw new Error('Empty response');
  } catch (err) {
    if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
      return PRODUCTS;
    }
    return [];
  }
}

async function getProductById(id) {
  try {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (err) {
    if (typeof PRODUCTS !== 'undefined' && Array.isArray(PRODUCTS)) {
      return PRODUCTS.find(p => p.id === id) || null;
    }
    return null;
  }
}

function getUrlParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i - rating < 1) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

function createProductCard(product) {
  const hasDiscount = product.discount > 0 && product.originalPrice;
  const soldOut = !product.inStock;
  return `
    <div class="product-card ${soldOut ? 'sold-out' : ''}" data-product-id="${product.id}">
      ${hasDiscount ? `<div class="discount-badge">$${product.discount} Off</div>` : ''}
      <a href="product-detail.html?id=${product.id}" class="product-image-link">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'product-placeholder\\'><i class=\\'fas fa-mobile-alt\\'></i></div>'">
          ${soldOut ? '<div class="sold-out-overlay"><span>Sold Out</span></div>' : ''}
        </div>
      </a>
      <a href="product-detail.html?id=${product.id}" class="product-name-link">
        <div class="product-name">${product.name}</div>
      </a>
      <div class="product-meta">
        <span class="product-brand-tag">${product.brand}</span>
        <span class="product-rating"><span class="stars">${renderStars(product.rating)}</span> ${product.rating}</span>
      </div>
      <div class="product-price">
        <span class="current-price">${formatPrice(product.price)}</span>
        ${hasDiscount ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
      </div>
      ${product.price >= 100 ? `<div class="monthly-payment">Or ${formatPrice(product.price / 12)}/mo. for 12 mo.</div>` : ''}
      ${hasDiscount ? `
        <div class="deal-timer">
          <i class="fas fa-clock"></i>
          <span>Deal ends in ${Math.floor(Math.random() * 30 + 5)}d</span>
        </div>
      ` : ''}
      <button class="btn-add-cart" data-product-id="${product.id}" ${soldOut ? 'disabled' : ''}>
        <i class="fas fa-shopping-cart"></i>
        ${soldOut ? 'Sold Out' : 'Add to Cart'}
      </button>
    </div>
  `;
}

document.addEventListener('click', async function (e) {
  const btn = e.target.closest('.btn-add-cart');
  if (!btn) return;
  e.preventDefault();
  if (btn.disabled) return;
  const productId = parseInt(btn.dataset.productId);

  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  const product = await getProductById(productId);
  if (!product) {
    btn.innerHTML = originalHTML;
    return;
  }

  Cart.addItem(product);
  Toast.show(`${product.name} added to cart!`, 'success');

  btn.innerHTML = '<i class="fas fa-check"></i> Added!';
  btn.classList.add('added');
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.classList.remove('added');
  }, 1500);
});

const animStyles = document.createElement('style');
animStyles.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }
`;
document.head.appendChild(animStyles);

// ─── THEME TOGGLE ───────────────────────────────────────────────
(function initTheme() {
  document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('shopflow-theme', 'light');
})();

window.toggleTheme = function() {
  const html = document.documentElement;
  if (html.getAttribute('data-theme') === 'dark') {
    html.removeAttribute('data-theme');
    localStorage.setItem('shopflow-theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
    localStorage.setItem('shopflow-theme', 'dark');
  }
};
