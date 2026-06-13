// ============================================================
// ShopFlow — Homepage Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Render header & footer (from app.js)
  renderHeader();
  renderFooter();

  // Initialize Homepage Content
  initHomepage();
});

function renderSkeletons(containerId, count) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-btn"></div>
    </div>
  `).join('');
}

async function initHomepage() {
  initHeroCarousel();
  renderBrands();
  renderCategories();

  // Show skeletons while loading
  renderSkeletons('special-offers-grid', 4);
  renderSkeletons('new-arrivals-grid', 8);
  renderSkeletons('smart-watches-grid', 4);
  renderSkeletons('accessories-grid', 4);

  // Fetch products from API
  const products = await fetchProducts();

  // Render products by section
  renderProductSection(products, 'special-offer', 'special-offers-grid', 4);
  renderProductSection(products, 'new-arrival', 'new-arrivals-grid', 8);
  renderProductSection(products, 'smart-watch', 'smart-watches-grid', 4);
  renderProductSection(products, 'accessories', 'accessories-grid', 4);

  // Observe rendered product cards for scroll reveal
  ['special-offers-grid', 'new-arrivals-grid', 'smart-watches-grid', 'accessories-grid'].forEach(id => addRevealToGrid(`#${id}`));
}

// ─── HERO CAROUSEL LOGIC ──────────────────────────────────────
const BANNERS = [
  {
    title: 'Discover the Next Level of Tech',
    desc: 'Experience the latest innovations in mobile technology. The all-new iPhone 17 Pro Max with A19 Pro chip and stunning Titanium design is here.',
    img: 'assets/iPhone 17 Pro Max.png',
    link: 'products.html'
  },
  {
    title: 'Precision on Your Wrist',
    desc: 'The new Series 10 Smartwatch. Advanced health tracking, stunning OLED display, and 7-day battery life.',
    img: 'assets/Venu 4 45mm - removed bg.png',
    link: 'products.html?category=Smart+Watch'
  },
  {
    title: 'Pure Sound, Zero Wires',
    desc: 'Immerse yourself in high-fidelity audio with our latest noise-canceling headphones collection.',
    img: 'assets/Galaxy Buds 4 - removed bg.png',
    link: 'products.html?category=Accessories'
  },
  {
    title: 'Smarter, Faster, Better',
    desc: 'Explore the Google Pixel 10a. The most helpful phone yet with AI-powered photography and seamless integration.',
    img: 'assets/Google Pixel 10a - removed bg.png',
    link: 'products.html'
  },
  {
    title: 'Unmatched Power',
    desc: 'Samsung Galaxy S26 Ultra. Rewrite the rules of productivity with the integrated S-Pen and 200MP camera.',
    img: 'assets/Samsung Galaxy S26 Ultra - removed bg.png',
    link: 'products.html'
  },
  {
    title: 'Pre-Loved, Pro Quality',
    desc: 'Get premium tech at a fraction of the cost. Certified pre-owned devices with 1-year warranty.',
    img: 'assets/iPhone 15 Pro Max - removed bg.png',
    link: 'products.html?category=SecondHand'
  },
  {
    title: 'Elevate Your Style',
    desc: 'Sleek designs and premium builds. Discover the minimalism of the Nothing Phone series.',
    img: 'assets/Nothing Phone (4a) - removed bg.png',
    link: 'products.html'
  },
  {
    title: 'The Watch That Does It All',
    desc: 'Garmin Venu 4. Your ultimate companion for fitness, health, and outdoor adventures.',
    img: 'assets/Venu 4 41mm - removed bg.png',
    link: 'products.html?category=Smart+Watch'
  },
  {
    title: 'Flash Sale: Up to 40% Off',
    desc: 'Limited time offers on our best-selling devices. Grab the Realme 16 Pro+ before they are gone!',
    img: 'assets/Realme 16 Pro+ - removed bg.png',
    link: 'products.html?filter=deals'
  },
  {
    title: 'The New Standard of Audio',
    desc: 'Experience crystal clear sound and adaptive transparency with the HUAWEI FreeClip series.',
    img: 'assets/HUAWEI FreeClip 2 - removed bg.png',
    link: 'products.html?category=Accessories'
  },
  {
    title: 'Stay Connected, Always',
    desc: 'Discover our range of high-speed chargers and power banks to keep your tech running all day.',
    img: 'assets/Fast Car Charger - removed bg.png',
    link: 'products.html?category=Accessories'
  }
];

let currentSlide = 0;
let carouselInterval;

function initHeroCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !dotsContainer) return;

  // Render Slides
  track.innerHTML = BANNERS.map(banner => `
    <div class="carousel-slide">
      <div class="slide-content">
        <h1>${banner.title}</h1>
        <p>${banner.desc}</p>
        <button class="btn-primary" onclick="window.location.href='${banner.link}'">
          AVAILABLE NOW! <i class="fas fa-arrow-right"></i>
        </button>
      </div >
      <div class="slide-image-container">
        <img src="${banner.img}" alt="${banner.title}" class="slide-image">
      </div >
    </div >
  `).join('');

  // Render Dots
  dotsContainer.innerHTML = BANNERS.map((_, i) => `
    <div class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})"></div>
  `).join('');

  startAutoScroll();
}

function updateCarousel() {
  const track = document.getElementById('carousel-track');
  const dots = document.querySelectorAll('.dot');
  if (!track) return;

  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

window.moveCarousel = function(direction) {
  currentSlide = (currentSlide + direction + BANNERS.length) % BANNERS.length;
  updateCarousel();
  resetAutoScroll();
};

window.goToSlide = function(index) {
  currentSlide = index;
  updateCarousel();
  resetAutoScroll();
};

function startAutoScroll() {
  carouselInterval = setInterval(() => {
    moveCarousel(1);
  }, 5000);
}

function resetAutoScroll() {
  clearInterval(carouselInterval);
  startAutoScroll();
}

// ─── OTHER HOMEPAGE RENDERING ──────────────────────────────────

function renderBrands() {
  const container = document.getElementById('brands-grid');
  if (!container) return;

  const displayBrands = BRANDS.slice(0, 12);

  container.innerHTML = displayBrands.map((brand, index) => {
    const isDark = index % 3 === 0;
    return `
      <div class="brand-item ${isDark ? 'dark' : ''}" onclick="window.location.href='products.html?brand=${encodeURIComponent(brand.name)}'">
        ${brand.image
          ? `<img src="${brand.image}" alt="${brand.name}">`
          : `${brand.icon ? `<i class="${brand.icon}" style="margin-bottom: 5px; font-size: 16px; display: block;"></i>` : ''}${brand.name}`}
      </div>
    `;
  }).join('');
}

function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <div class="category-card" onclick="window.location.href='products.html?category=${encodeURIComponent(cat.name)}'">
      <div class="category-icon">
        <i class="${cat.icon}"></i>
      </div>
      <div class="category-name">${cat.name}</div>
      <div class="category-link">Shop Now <i class="fas fa-chevron-right" style="font-size: 10px;"></i></div>
    </div>
  `).join('');
}

function renderProductSection(products, sectionName, containerId, limit = 4) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const sectionProducts = products.filter(p => p.section === sectionName).slice(0, limit);

  if (sectionProducts.length === 0) {
    container.innerHTML = '<p style="color: var(--text-secondary);">Products arriving soon.</p>';
    return;
  }

  container.innerHTML = sectionProducts.map(p => createProductCard(p)).join('');
}
