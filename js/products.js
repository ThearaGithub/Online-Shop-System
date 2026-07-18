// ============================================================
// ShopFlow — Products Catalog Logic
// ============================================================

// Manual color-to-product mapping (product name lowercase -> color tags)
const PRODUCT_COLORS = {
  'samsung galaxy s26 ultra': ['black'],
  'samsung s26': ['white'],
  'iphone 17e': ['pink'],
  'iphone 15 pro max': ['gold', 'white', 'black'],
  'apple watch ultra 3': ['black'],
  'airpods pro 3': ['white'],
  'iphone 17 pro max': ['orange'],
  'oppo find x9 pro': ['gray'],
  'nothing phone (4a) pro': ['white'],
  'nothing phone (4a)': ['blue'],
  'oppo a6': ['gold'],
  'google pixel 10a': ['red'],
  'realme 16 pro+': ['gold'],
  'vivo v70 fe': ['purple'],
  'hmd watch p1': ['black'],
  'xiaomi smart band 10': ['pink'],
  'garmin venu 4 (45mm)': ['black'],
  'garmin venu 4 (41mm)': ['white', 'gold'],
  'huawei freeclip 2': ['black'],
  'samsung galaxy buds 4': ['white'],
  'mcdodo usb-c 100w charger': ['white'],
  'fast car charger 65w': ['silver'],
  'bose quietcomfort ultra': ['black'],
  'iphone 13 pro': ['gray'],
  'samsung galaxy s23': ['silver', 'white'],
  'google pixel 8 (used)': ['gold'],
  'iphone 14 (used)': ['black'],
  'huawei pura 80 pro': ['white'],
  'iphone 14 pro max': ['black']
};

let allProducts = [];
let currentProducts = [];
let currentFilters = {
  search: '',
  category: '',
  brand: [],
  minPrice: '',
  maxPrice: '',
  minRating: '',
  screenSize: [],
  color: [],
  inStockOnly: true,
  dealsOnly: false
};
let currentSort = 'featured';

function renderSkeletons(count) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-line long"></div>
      <div class="skeleton-line medium"></div>
      <div class="skeleton-line short"></div>
      <div class="skeleton-btn"></div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  
  renderSkeletons(12);
  
  // Fetch products from API
  allProducts = await fetchProducts();
  currentProducts = [...allProducts];
  
  // Parse URL parameters for initial filters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('search')) currentFilters.search = urlParams.get('search');
  if (urlParams.has('category')) currentFilters.category = urlParams.get('category');
  if (urlParams.has('brand')) currentFilters.brand.push(urlParams.get('brand'));
  if (urlParams.has('filter') && urlParams.get('filter') === 'deals') currentFilters.dealsOnly = true;
  if (urlParams.has('minPrice')) currentFilters.minPrice = urlParams.get('minPrice');
  if (urlParams.has('maxPrice')) currentFilters.maxPrice = urlParams.get('maxPrice');
  if (urlParams.has('section')) {
    currentFilters.section = urlParams.get('section');
  }

  // Set initial UI state
  updatePageTitle();
  initSidebar();
  
  // Apply filters and render
  applyFiltersAndSort();
  
  // Event Listeners
  document.getElementById('sort-by').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndSort();
  });
  
  document.getElementById('btn-apply-price').addEventListener('click', () => {
    currentFilters.minPrice = document.getElementById('price-min').value;
    currentFilters.maxPrice = document.getElementById('price-max').value;
    const params = new URLSearchParams(window.location.search);
    if (currentFilters.minPrice) params.set('minPrice', currentFilters.minPrice);
    else params.delete('minPrice');
    if (currentFilters.maxPrice) params.set('maxPrice', currentFilters.maxPrice);
    else params.delete('maxPrice');
    window.history.replaceState(null, '', `?${params.toString()}`);
    applyFiltersAndSort();
  });
  
  document.getElementById('filter-instock').addEventListener('change', (e) => {
    currentFilters.inStockOnly = e.target.checked;
    applyFiltersAndSort();
  });
  
  document.getElementById('filter-deals').addEventListener('change', (e) => {
    currentFilters.dealsOnly = e.target.checked;
    applyFiltersAndSort();
  });
  
  document.getElementById('btn-reset-filters').addEventListener('click', () => {
    window.location.href = 'products.html'; // simplest way to reset completely
  });
});

// ─── FILTER COLLAPSE ─────────────────────────────────────
window.toggleFilter = function(header) {
  const content = header.nextElementSibling;
  const icon = header.querySelector('i');
  if (content && content.classList.contains('filter-content')) {
    const isOpen = content.style.display !== 'none';
    content.style.display = isOpen ? 'none' : '';
    if (icon) icon.className = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
  }
};

window.toggleAllFilters = function() {
  const allCollapsed = document.querySelectorAll('.filter-content').length === document.querySelectorAll('.filter-content[style*="display: none"]').length;
  document.querySelectorAll('.filter-content').forEach(el => {
    el.style.display = allCollapsed ? '' : 'none';
  });
  document.querySelectorAll('.filter-group h4 i').forEach(icon => {
    icon.className = allCollapsed ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
  });
  document.querySelector('.filter-toggle-all').textContent = allCollapsed ? 'Collapse All' : 'Expand All';
};

function updatePageTitle() {
  const titleEl = document.getElementById('page-title');
  const breadcrumbEl = document.getElementById('breadcrumb-current');
  
  if (currentFilters.search) {
    titleEl.textContent = `Search: "${currentFilters.search}"`;
    breadcrumbEl.innerHTML = `<span>/</span> Search`;
  } else if (currentFilters.category) {
    titleEl.textContent = currentFilters.category;
    breadcrumbEl.innerHTML = `<span>/</span> ${currentFilters.category}`;
  } else if (currentFilters.dealsOnly) {
    titleEl.textContent = "Special Offers";
    breadcrumbEl.innerHTML = `<span>/</span> Deals`;
  }
}

function initSidebar() {
  // Render Categories
  const catContainer = document.getElementById('filter-categories');
  catContainer.innerHTML = CATEGORIES.map(cat => {
    const count = allProducts.filter(p => p.category === cat.name).length;
    return `
      <label class="filter-option">
        <input type="radio" name="cat-filter" value="${cat.name}" 
          ${currentFilters.category === cat.name ? 'checked' : ''}
          onchange="updateCategory('${cat.name}')">
        ${cat.name}
        <span class="count">(${count})</span>
      </label>
    `;
  }).join('');
  
  // Add 'All' category option at the top
  catContainer.insertAdjacentHTML('afterbegin', `
    <label class="filter-option">
      <input type="radio" name="cat-filter" value="" 
        ${!currentFilters.category ? 'checked' : ''}
        onchange="updateCategory('')">
      All Categories
      <span class="count">(${allProducts.length})</span>
    </label>
  `);

  // Render Brands (only those that actually have products)
  const brandContainer = document.getElementById('filter-brands');
  const activeBrands = [...new Set(allProducts.map(p => p.brand))].sort();
  
  brandContainer.innerHTML = activeBrands.map(brand => {
    const count = allProducts.filter(p => p.brand === brand).length;
    const isChecked = currentFilters.brand.includes(brand) ? 'checked' : '';
    return `
      <label class="filter-option">
        <input type="checkbox" value="${brand}" ${isChecked} onchange="updateBrand(this)">
        ${brand}
        <span class="count">(${count})</span>
      </label>
    `;
  }).join('');
  
  // Render Screen Size filters (from specs.display)
  const screenContainer = document.getElementById('filter-screen-size');
  const allSizes = [...new Set(allProducts.flatMap(p => {
    if (!p.specs || !p.specs.display || p.specs.display === '—') return [];
    const match = p.specs.display.match(/^([\d.]+)"/);
    return match ? [match[1]] : [];
  }))].sort((a, b) => parseFloat(a) - parseFloat(b));
  screenContainer.innerHTML = allSizes.map(s => `
    <label class="filter-option">
      <input type="checkbox" value="${s}" onchange="updateScreenSize(this)">
      ${s}"
    </label>
  `).join('') || '<span style="color:var(--text-muted);font-size:12px;">N/A</span>';

  // Render Color filters (from manual mapping)
  const colorContainer = document.getElementById('filter-colors');
  const allColors = [...new Set(Object.values(PRODUCT_COLORS).flat())].sort();
  colorContainer.innerHTML = allColors.map(c => `
    <label class="filter-option">
      <input type="checkbox" value="${c}" onchange="updateColor(this)">
      ${c}
    </label>
  `).join('');

  // Set initial checkbox states
  if (currentFilters.dealsOnly) document.getElementById('filter-deals').checked = true;

  // Pre-fill price inputs from URL params
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  if (currentFilters.minPrice) priceMin.value = currentFilters.minPrice;
  if (currentFilters.maxPrice) priceMax.value = currentFilters.maxPrice;
}

// Global functions for inline event handlers
window.updateCategory = function(cat) {
  currentFilters.category = cat;
  applyFiltersAndSort();
  updatePageTitle();
};

window.updateBrand = function(checkbox) {
  if (checkbox.checked) {
    currentFilters.brand.push(checkbox.value);
  } else {
    currentFilters.brand = currentFilters.brand.filter(b => b !== checkbox.value);
  }
  applyFiltersAndSort();
};

window.updateRating = function(val) {
  currentFilters.minRating = val;
  applyFiltersAndSort();
};

window.updateScreenSize = function(checkbox) {
  if (checkbox.checked) {
    currentFilters.screenSize.push(checkbox.value);
  } else {
    currentFilters.screenSize = currentFilters.screenSize.filter(s => s !== checkbox.value);
  }
  applyFiltersAndSort();
};

window.updateColor = function(checkbox) {
  if (checkbox.checked) {
    currentFilters.color.push(checkbox.value);
  } else {
    currentFilters.color = currentFilters.color.filter(c => c !== checkbox.value);
  }
  applyFiltersAndSort();
};

function applyFiltersAndSort() {
  let filtered = [...allProducts];

  // 1. Search filter
  if (currentFilters.search) {
    const q = currentFilters.search.toLowerCase().replace(/\s/g, '');
    filtered = filtered.filter(p => 
      p.name.toLowerCase().replace(/\s/g, '').includes(q) || 
      p.brand.toLowerCase().replace(/\s/g, '').includes(q) || 
      p.description.toLowerCase().replace(/\s/g, '').includes(q)
    );
  }

  // 2. Section filter
  if (currentFilters.section) {
    filtered = filtered.filter(p => p.section === currentFilters.section);
  }

  // 3. Category filter
  if (currentFilters.category) {
    filtered = filtered.filter(p => p.category === currentFilters.category);
  }

  // 4. Brand filter
  if (currentFilters.brand.length > 0) {
    filtered = filtered.filter(p => currentFilters.brand.includes(p.brand));
  }

  // 5. Price filter with validation
  const priceError = document.getElementById('price-error');
  const minP = parseFloat(currentFilters.minPrice);
  const maxP = parseFloat(currentFilters.maxPrice);
  if (currentFilters.minPrice && currentFilters.maxPrice && minP > maxP) {
    priceError.textContent = 'Min price cannot be higher than max price.';
    priceError.style.display = 'block';
  } else if (currentFilters.minPrice) {
    const maxProductPrice = Math.max(...allProducts.map(p => p.price));
    if (minP > maxProductPrice) {
      priceError.textContent = `No products above $${minP.toFixed(2)}. Max price is $${maxProductPrice.toFixed(2)}.`;
      priceError.style.display = 'block';
    } else {
      priceError.style.display = 'none';
    }
  } else if (currentFilters.maxPrice) {
    const minProductPrice = Math.min(...allProducts.map(p => p.price));
    if (maxP < minProductPrice) {
      priceError.textContent = `No products below $${maxP.toFixed(2)}. Min price is $${minProductPrice.toFixed(2)}.`;
      priceError.style.display = 'block';
    } else {
      priceError.style.display = 'none';
    }
  } else {
    priceError.style.display = 'none';
  }
  if (currentFilters.minPrice) {
    filtered = filtered.filter(p => p.price >= minP);
  }
  if (currentFilters.maxPrice) {
    filtered = filtered.filter(p => p.price <= maxP);
  }

  // 6. Rating filter
  if (currentFilters.minRating) {
    filtered = filtered.filter(p => p.rating >= parseFloat(currentFilters.minRating));
  }

  // 7. Screen Size filter
  if (currentFilters.screenSize.length > 0) {
    filtered = filtered.filter(p => {
      if (!p.specs || !p.specs.display || p.specs.display === '—') return false;
      const match = p.specs.display.match(/^([\d.]+)"/);
      return match && currentFilters.screenSize.includes(match[1]);
    });
  }

  // 8. Color filter (using manual mapping)
  if (currentFilters.color.length > 0) {
    filtered = filtered.filter(p => {
      const tags = PRODUCT_COLORS[p.name.toLowerCase()];
      return tags && currentFilters.color.some(c => tags.includes(c.toLowerCase()));
    });
  }

  // 9. Availability & Deals
  if (currentFilters.inStockOnly) {
    filtered = filtered.filter(p => p.inStock);
  }
  if (currentFilters.dealsOnly) {
    filtered = filtered.filter(p => p.discount > 0);
  }

  // 10. Sorting
  switch(currentSort) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => b.id - a.id); // Assuming higher ID is newer
      break;
    case 'featured':
    default:
      filtered.sort((a, b) => (b.featured === a.featured) ? 0 : b.featured ? 1 : -1);
      break;
  }

  currentProducts = filtered;
  renderProducts();
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  const countEl = document.getElementById('results-count');
  
  countEl.textContent = `Showing ${currentProducts.length} result${currentProducts.length !== 1 ? 's' : ''}`;
  
  if (currentProducts.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search criteria.</p>
        <button class="btn-primary" onclick="window.location.href='products.html'" style="margin-top: 15px;">Clear Filters</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = currentProducts.map(p => createProductCard(p)).join('');
  addRevealToGrid('#products-grid');
}
