// ============================================================
// ShopFlow — Product Catalog Data
// ============================================================
const PRODUCTS = [
  // ─── MOBILE PHONES ────────────────────────────────────────
  {
    id: 1,
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    category: "Mobile Phone",
    price: 1599.00,
    originalPrice: 1799.00,
    discount: 200,
    description: "The iPhone 17 Pro Max features a stunning 6.9-inch OLED ProMotion display, the blazing-fast A19 Pro chip built on 3nm technology, and an advanced 48MP Fusion camera system with 5x optical zoom. Titanium design, USB-C, and all-day battery life.",
    specs: {
      display: '6.9" Super Retina XDR OLED, 120Hz ProMotion',
      processor: "A19 Pro (3nm)",
      ram: "12GB",
      storage: ["256GB", "512GB", "1TB"],
      camera: "48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto",
      battery: "4685 mAh",
      os: "iOS 19",
      weight: "227g"
    },
    colors: [
      { name: "Natural Titanium", hex: "#9a8e7f" },
      { name: "Blue Titanium", hex: "#3d4f5f" },
      { name: "White Titanium", hex: "#f5f0e8" },
      { name: "Black Titanium", hex: "#2c2c2e" }
    ],
    rating: 4.9,
    reviews: 1240,
    inStock: true,
    featured: true,
    section: "special-offer",
    image: "assets/iPhone 17 Pro Max.png"
  },
  {
    id: 2,
    name: "Galaxy S26 Ultra",
    brand: "Samsung",
    category: "Mobile Phone",
    price: 1369.00,
    originalPrice: 1539.00,
    discount: 170,
    description: "Samsung Galaxy S26 Ultra features a 6.9-inch Dynamic AMOLED 2X display, Snapdragon 8 Elite chipset, 200MP camera, built-in S Pen, and massive 5000mAh battery with 45W fast charging.",
    specs: {
      display: '6.9" Dynamic AMOLED 2X, 120Hz',
      processor: "Snapdragon 8 Elite",
      ram: "12GB",
      storage: ["256GB", "512GB", "1TB"],
      camera: "200MP Main + 50MP Ultra Wide + 10MP 3x + 50MP 5x",
      battery: "5000 mAh",
      os: "Android 16, One UI 8",
      weight: "218g"
    },
    colors: [
      { name: "Titanium Black", hex: "#2c2c2e" },
      { name: "Titanium Gray", hex: "#8a8a8a" },
      { name: "Titanium Blue", hex: "#4a6fa5" },
      { name: "Titanium Silver", hex: "#c0c0c0" }
    ],
    rating: 4.8,
    reviews: 980,
    inStock: true,
    featured: true,
    section: "special-offer",
    image: "assets/Samsung Galaxy S26 Ultra.png"
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Mobile Phone",
    price: 1369.00,
    originalPrice: 1539.00,
    discount: 170,
    description: "iPhone 15 Pro Max with A17 Pro chip, 6.7-inch display, titanium design, 48MP camera system, and USB-C connectivity.",
    specs: {
      display: '6.7" Super Retina XDR OLED, 120Hz',
      processor: "A17 Pro (3nm)",
      ram: "8GB",
      storage: ["256GB", "512GB", "1TB"],
      camera: "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
      battery: "4441 mAh",
      os: "iOS 17",
      weight: "221g"
    },
    colors: [
      { name: "Natural Titanium", hex: "#9a8e7f" },
      { name: "Blue Titanium", hex: "#3d4f5f" },
      { name: "White Titanium", hex: "#f5f0e8" },
      { name: "Black Titanium", hex: "#2c2c2e" }
    ],
    rating: 4.8,
    reviews: 3200,
    inStock: true,
    featured: true,
    section: "special-offer",
    image: "assets/iPhone 15 Pro Max.png"
  },
  {
    id: 4,
    name: "Samsung S26",
    brand: "Samsung",
    category: "Mobile Phone",
    price: 1149.00,
    originalPrice: 1249.00,
    discount: 100,
    description: "Samsung Galaxy S26 with 6.2-inch Dynamic AMOLED, Snapdragon 8 Elite, 50MP triple camera, and 4000mAh battery.",
    specs: {
      display: '6.2" Dynamic AMOLED 2X, 120Hz',
      processor: "Snapdragon 8 Elite",
      ram: "12GB",
      storage: ["128GB", "256GB"],
      camera: "50MP Main + 12MP Ultra Wide + 10MP 3x Telephoto",
      battery: "4000 mAh",
      os: "Android 16, One UI 8",
      weight: "167g"
    },
    colors: [
      { name: "Icy Blue", hex: "#a8c8e8" },
      { name: "Mint", hex: "#a8e8c8" },
      { name: "Navy", hex: "#2a3f5f" },
      { name: "Silver Shadow", hex: "#c0c0c0" }
    ],
    rating: 4.7,
    reviews: 520,
    inStock: true,
    featured: true,
    section: "special-offer",
    image: "assets/Samsung S26.png"
  },
  {
    id: 5,
    name: "OPPO Find X9 Pro",
    brand: "OPPO",
    category: "Mobile Phone",
    price: 1369.00,
    originalPrice: 1539.00,
    discount: 170,
    description: "OPPO Find X9 Pro features Hasselblad camera system, 6.82-inch LTPO AMOLED display, Dimensity 9400, and 5800mAh silicon-carbon battery.",
    specs: {
      display: '6.82" LTPO AMOLED, 120Hz',
      processor: "Dimensity 9400",
      ram: "16GB",
      storage: ["256GB", "512GB"],
      camera: "50MP Main + 50MP Ultra Wide + 50MP 3x Telephoto",
      battery: "5800 mAh",
      os: "Android 15, ColorOS 15",
      weight: "215g"
    },
    colors: [
      { name: "Space Black", hex: "#1a1a2e" },
      { name: "Hazel Brown", hex: "#8b6c5c" }
    ],
    rating: 4.7,
    reviews: 340,
    inStock: true,
    featured: false,
    section: "special-offer",
    image: "assets/OPPO Find X9 Pro.png"
  },
  {
    id: 6,
    name: "iPhone 17e",
    brand: "Apple",
    category: "Mobile Phone",
    price: 769.00,
    originalPrice: null,
    discount: 0,
    description: "iPhone 17e — the most affordable iPhone 17 with A19 chip, 6.1-inch OLED display, 48MP camera, Dynamic Island, and USB-C. Perfect balance of power and value.",
    specs: {
      display: '6.1" OLED, 60Hz',
      processor: "A19",
      ram: "8GB",
      storage: ["128GB", "256GB", "512GB"],
      camera: "48MP Main + 12MP Ultra Wide",
      battery: "3561 mAh",
      os: "iOS 19",
      weight: "170g"
    },
    colors: [
      { name: "Black", hex: "#1a1a2e" },
      { name: "Soft Pink", hex: "#f8bbd0" },
      { name: "White", hex: "#f5f5f5" }
    ],
    rating: 4.6,
    reviews: 890,
    inStock: true,
    featured: true,
    section: "new-arrival",
    image: "assets/iPhone 17e.png"
  },
  {
    id: 7,
    name: "Nothing Phone (4a) Pro",
    brand: "Nothing",
    category: "Mobile Phone",
    price: 999.00,
    originalPrice: null,
    discount: 0,
    description: "Nothing Phone (4a) Pro with Glyph Interface, Snapdragon 7s Gen 3, 50MP dual camera, and transparent design.",
    specs: {
      display: '6.7" AMOLED, 120Hz',
      processor: "Snapdragon 7s Gen 3",
      ram: "12GB",
      storage: ["256GB"],
      camera: "50MP Main + 50MP Ultra Wide",
      battery: "5000 mAh",
      os: "Android 15, Nothing OS 3",
      weight: "190g"
    },
    colors: [
      { name: "White", hex: "#f5f5f5" },
      { name: "Black", hex: "#1a1a2e" }
    ],
    rating: 4.5,
    reviews: 420,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/Nothing Phone (4a) Pro.png"
  },
  {
    id: 8,
    name: "Nothing Phone (4a)",
    brand: "Nothing",
    category: "Mobile Phone",
    price: 449.00,
    originalPrice: null,
    discount: 0,
    description: "Nothing Phone (4a) with Glyph Interface, MediaTek Dimensity 7300, clean design, and smooth 120Hz AMOLED display.",
    specs: {
      display: '6.6" AMOLED, 120Hz',
      processor: "MediaTek Dimensity 7300",
      ram: "8GB",
      storage: ["128GB", "256GB"],
      camera: "50MP Main + 8MP Ultra Wide",
      battery: "5000 mAh",
      os: "Android 15, Nothing OS 3",
      weight: "188g"
    },
    colors: [
      { name: "White", hex: "#f5f5f5" },
      { name: "Black", hex: "#1a1a2e" }
    ],
    rating: 4.4,
    reviews: 310,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/Nothing Phone (4a).png"
  },
  {
    id: 9,
    name: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    category: "Mobile Phone",
    price: 1539.00,
    originalPrice: null,
    discount: 0,
    description: "The flagship Samsung Galaxy S26 Ultra with S Pen, 200MP camera, and Snapdragon 8 Elite processor.",
    specs: {
      display: '6.9" Dynamic AMOLED 2X, 120Hz',
      processor: "Snapdragon 8 Elite",
      ram: "12GB",
      storage: ["256GB", "512GB", "1TB"],
      camera: "200MP Main + 50MP Ultra Wide + 10MP 3x + 50MP 5x",
      battery: "5000 mAh",
      os: "Android 16, One UI 8",
      weight: "218g"
    },
    colors: [
      { name: "Titanium Black", hex: "#2c2c2e" },
      { name: "Titanium Blue", hex: "#4a6fa5" }
    ],
    rating: 4.8,
    reviews: 670,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/Samsung Galaxy S26 Ultra.png"
  },
  {
    id: 10,
    name: "OPPO A6",
    brand: "OPPO",
    category: "Mobile Phone",
    price: 229.00,
    originalPrice: null,
    discount: 0,
    description: "OPPO A6 — affordable smartphone with 6.67-inch HD+ display, Helio G36, 50MP camera, and 5100mAh battery for all-day use.",
    specs: {
      display: '6.67" HD+ LCD, 90Hz',
      processor: "MediaTek Helio G36",
      ram: "4GB",
      storage: ["128GB"],
      camera: "50MP Main + 2MP Depth",
      battery: "5100 mAh",
      os: "Android 14, ColorOS 14",
      weight: "192g"
    },
    colors: [
      { name: "Sparkle Black", hex: "#1a1a2e" },
      { name: "Sparkle Blue", hex: "#4a6fa5" }
    ],
    rating: 4.2,
    reviews: 180,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/OPPO A6.png"
  },
  {
    id: 11,
    name: "Google Pixel 10a",
    brand: "Google",
    category: "Mobile Phone",
    price: 499.00,
    originalPrice: null,
    discount: 0,
    description: "Google Pixel 10a with Tensor G5 chip, outstanding camera, 7 years of updates, and pure Android experience.",
    specs: {
      display: '6.3" OLED, 120Hz',
      processor: "Google Tensor G5",
      ram: "8GB",
      storage: ["128GB", "256GB"],
      camera: "64MP Main + 13MP Ultra Wide",
      battery: "4500 mAh",
      os: "Android 16",
      weight: "185g"
    },
    colors: [
      { name: "Charcoal", hex: "#2c2c2e" },
      { name: "Porcelain", hex: "#f5f0e8" },
      { name: "Bay", hex: "#4a8fa5" }
    ],
    rating: 4.6,
    reviews: 560,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/Google Pixel 10a.png"
  },
  {
    id: 12,
    name: "Realme 16 Pro+",
    brand: "Realme",
    category: "Mobile Phone",
    price: 399.00,
    originalPrice: null,
    discount: 0,
    description: "Realme 16 Pro+ with Dimensity 8400, 200MP camera, 120Hz AMOLED, and 80W fast charging.",
    specs: {
      display: '6.7" AMOLED, 120Hz',
      processor: "Dimensity 8400",
      ram: "12GB",
      storage: ["256GB", "512GB"],
      camera: "200MP Main + 8MP Ultra Wide",
      battery: "5500 mAh",
      os: "Android 15, Realme UI 6",
      weight: "191g"
    },
    colors: [
      { name: "Lightning Blue", hex: "#2a5f9f" },
      { name: "Dark Silk", hex: "#1a1a2e" }
    ],
    rating: 4.5,
    reviews: 290,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/Realme 16 Pro+.png"
  },
  {
    id: 13,
    name: "vivo V70 FE",
    brand: "vivo",
    category: "Mobile Phone",
    price: 329.00,
    originalPrice: null,
    discount: 0,
    description: "vivo V70 FE with 50MP OIS camera, 6.67-inch AMOLED display, Dimensity 6300, and sleek ultra-slim design.",
    specs: {
      display: '6.67" AMOLED, 120Hz',
      processor: "Dimensity 6300",
      ram: "8GB",
      storage: ["128GB", "256GB"],
      camera: "50MP OIS Main + 2MP Depth",
      battery: "5500 mAh",
      os: "Android 15, Funtouch OS 15",
      weight: "179g"
    },
    colors: [
      { name: "Royal Bronze", hex: "#8b6c5c" },
      { name: "Titanium Silver", hex: "#c0c0c0" }
    ],
    rating: 4.3,
    reviews: 150,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/vivo V70 FE.png"
  },

  // ─── SMART WATCHES ────────────────────────────────────────
  {
    id: 14,
    name: "HMD Watch P1",
    brand: "HMD",
    category: "Smart Watch",
    price: 49.00,
    originalPrice: null,
    discount: 0,
    description: "HMD Watch P1 with 1.8-inch display, heart rate monitoring, SpO2, 7-day battery life, and IP68 water resistance.",
    specs: {
      display: '1.8" IPS LCD',
      processor: "Realtek RTL8763E",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "260 mAh (7 days)",
      os: "HMD Watch OS",
      weight: "45g"
    },
    colors: [
      { name: "Black", hex: "#1a1a2e" },
      { name: "Silver", hex: "#c0c0c0" }
    ],
    rating: 4.0,
    reviews: 120,
    inStock: true,
    featured: false,
    section: "smart-watch",
    image: "assets/HMD Watch P1.png"
  },
  {
    id: 15,
    name: "Xiaomi Smart Band 10",
    brand: "Xiaomi",
    category: "Smart Watch",
    price: 45.00,
    originalPrice: null,
    discount: 0,
    description: "Xiaomi Smart Band 10 with 1.62-inch AMOLED, 14-day battery, 150+ workout modes, SpO2, and stress monitoring.",
    specs: {
      display: '1.62" AMOLED',
      processor: "Dialog DA14706",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "233 mAh (14 days)",
      os: "Xiaomi HyperOS",
      weight: "24g"
    },
    colors: [
      { name: "Black", hex: "#1a1a2e" },
      { name: "Champagne Gold", hex: "#d4a574" }
    ],
    rating: 4.4,
    reviews: 2100,
    inStock: true,
    featured: false,
    section: "smart-watch",
    image: "assets/Smart Band 10.png"
  },
  {
    id: 16,
    name: "Garmin Venu 4 (45mm)",
    brand: "Garmin",
    category: "Smart Watch",
    price: 579.00,
    originalPrice: null,
    discount: 0,
    description: "Garmin Venu 4 with brilliant AMOLED, advanced health monitoring, Body Battery, 10-day battery, and 30+ built-in sports apps.",
    specs: {
      display: '1.4" AMOLED',
      processor: "Garmin Custom SoC",
      ram: "—",
      storage: ["8GB Music"],
      camera: "—",
      battery: "Up to 10 days",
      os: "Garmin OS",
      weight: "52g"
    },
    colors: [
      { name: "Slate/Black", hex: "#2c2c2e" },
      { name: "Silver/Gray", hex: "#c0c0c0" }
    ],
    rating: 4.7,
    reviews: 430,
    inStock: true,
    featured: false,
    section: "smart-watch",
    image: "assets/Venu 4 45mm.png"
  },
  {
    id: 17,
    name: "Garmin Venu 4 (41mm)",
    brand: "Garmin",
    category: "Smart Watch",
    price: 549.00,
    originalPrice: null,
    discount: 0,
    description: "Garmin Venu 4 (41mm) — smaller-sized fitness smartwatch with the same premium features in a more compact design.",
    specs: {
      display: '1.2" AMOLED',
      processor: "Garmin Custom SoC",
      ram: "—",
      storage: ["8GB Music"],
      camera: "—",
      battery: "Up to 8 days",
      os: "Garmin OS",
      weight: "42g"
    },
    colors: [
      { name: "White/Gold", hex: "#f5f0e8" },
      { name: "Black/Slate", hex: "#2c2c2e" }
    ],
    rating: 4.7,
    reviews: 380,
    inStock: true,
    featured: false,
    section: "smart-watch",
    image: "assets/Venu 4 41mm.png"
  },
  {
    id: 18,
    name: "Apple Watch Ultra 3",
    brand: "Apple",
    category: "Smart Watch",
    price: 899.00,
    originalPrice: 999.00,
    discount: 100,
    description: "Apple Watch Ultra 3 — rugged titanium case, precision dual-frequency GPS, 72-hour battery, depth gauge, and advanced health sensors.",
    specs: {
      display: '1.93" LTPO OLED, Always-On',
      processor: "Apple S10",
      ram: "1.5GB",
      storage: ["64GB"],
      camera: "—",
      battery: "Up to 72 hours",
      os: "watchOS 12",
      weight: "61g"
    },
    colors: [
      { name: "Natural Titanium", hex: "#9a8e7f" },
      { name: "Black Titanium", hex: "#2c2c2e" }
    ],
    rating: 4.9,
    reviews: 860,
    inStock: true,
    featured: true,
    section: "smart-watch",
    image: "assets/Venu 4 45mm.png"
  },

  // ─── ACCESSORIES ──────────────────────────────────────────
  {
    id: 19,
    name: "HUAWEI FreeClip 2",
    brand: "Huawei",
    category: "Accessories",
    price: 169.00,
    originalPrice: null,
    discount: 0,
    description: "HUAWEI FreeClip 2 open-ear earbuds with C-bridge design, adaptive EQ, 36-hour total battery, and IP54 water resistance.",
    specs: {
      display: "—",
      processor: "—",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "8h + 28h case",
      os: "Bluetooth 5.3",
      weight: "5.6g per bud"
    },
    colors: [
      { name: "Black", hex: "#1a1a2e" },
      { name: "Purple", hex: "#8b5cf6" },
      { name: "Beige", hex: "#f5e6d3" }
    ],
    rating: 4.5,
    reviews: 340,
    inStock: true,
    featured: false,
    section: "accessories",
    image: "assets/HUAWEI FreeClip 2.png"
  },
  {
    id: 20,
    name: "Samsung Galaxy Buds 4",
    brand: "Samsung",
    category: "Accessories",
    price: 179.00,
    originalPrice: null,
    discount: 0,
    description: "Galaxy Buds 4 with adaptive ANC, 360 Audio, Blade Beam driver, and comfortable canal-type fit. 30h total battery.",
    specs: {
      display: "—",
      processor: "—",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "6.5h + 23.5h case",
      os: "Bluetooth 5.4",
      weight: "4.7g per bud"
    },
    colors: [
      { name: "Gray", hex: "#8a8a8a" },
      { name: "White", hex: "#f5f5f5" },
      { name: "Green", hex: "#7ab87a" }
    ],
    rating: 4.6,
    reviews: 520,
    inStock: true,
    featured: false,
    section: "accessories",
    image: "assets/Galaxy Buds 4.png"
  },
  {
    id: 21,
    name: "Mcdodo USB-C 100W Charger",
    brand: "Mcdodo",
    category: "Accessories",
    price: 89.00,
    originalPrice: null,
    discount: 0,
    description: "Mcdodo 100W GaN USB-C charger with PD3.0 & QC5.0 fast charging. Compact foldable plug design for travel.",
    specs: {
      display: "—",
      processor: "—",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "—",
      os: "USB-C PD 3.0",
      weight: "120g"
    },
    colors: [
      { name: "White", hex: "#f5f5f5" },
      { name: "Black", hex: "#1a1a2e" }
    ],
    rating: 4.4,
    reviews: 230,
    inStock: true,
    featured: false,
    section: "accessories",
    image: "assets/USB-C Charger.png"
  },
  {
    id: 22,
    name: "Fast Car Charger 65W",
    brand: "REMAX",
    category: "Accessories",
    price: 15.00,
    originalPrice: null,
    discount: 0,
    description: "REMAX 65W dual-port car charger with USB-C PD and USB-A QC3.0. LED voltage display and compact metal design.",
    specs: {
      display: "—",
      processor: "—",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "—",
      os: "USB-C PD + USB-A QC3.0",
      weight: "35g"
    },
    colors: [
      { name: "Silver", hex: "#c0c0c0" }
    ],
    rating: 4.3,
    reviews: 190,
    inStock: true,
    featured: false,
    section: "accessories",
    image: "assets/Fast Car Charger.png"
  },
  {
    id: 23,
    name: "AirPods Pro 3",
    brand: "Apple",
    category: "Accessories",
    price: 279.00,
    originalPrice: null,
    discount: 0,
    description: "AirPods Pro 3 with H3 chip, Adaptive Audio, Conversation Awareness, Personalized Spatial Audio, and USB-C MagSafe case.",
    specs: {
      display: "—",
      processor: "H3 Chip",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "6h + 30h case",
      os: "Bluetooth 5.3",
      weight: "5.3g per bud"
    },
    colors: [
      { name: "White", hex: "#f5f5f5" }
    ],
    rating: 4.8,
    reviews: 4500,
    inStock: true,
    featured: true,
    section: "accessories",
    image: "assets/AirPods Pro 3.png"
  },
  {
    id: 24,
    name: "JBL Tune Beam 3",
    brand: "JBL",
    category: "Accessories",
    price: 99.00,
    originalPrice: 129.00,
    discount: 30,
    description: "JBL Tune Beam 3 with Pure Bass Sound, ANC, 48h total battery, 4-mic calls, and IP54 splash proof.",
    specs: {
      display: "—",
      processor: "—",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "10h + 38h case",
      os: "Bluetooth 5.3",
      weight: "5g per bud"
    },
    colors: [
      { name: "Black", hex: "#1a1a2e" },
      { name: "Blue", hex: "#2a5f9f" },
      { name: "White", hex: "#f5f5f5" }
    ],
    rating: 4.3,
    reviews: 310,
    inStock: true,
    featured: false,
    section: "accessories",
    image: "assets/placeholder.svg"
  },
  {
    id: 25,
    name: "BOSE QuietComfort Ultra",
    brand: "BOSE",
    category: "Accessories",
    price: 429.00,
    originalPrice: null,
    discount: 0,
    description: "BOSE QC Ultra headphones with world-class noise cancellation, Immersive Audio, CustomTune, and 24-hour battery.",
    specs: {
      display: "—",
      processor: "—",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "24 hours",
      os: "Bluetooth 5.3",
      weight: "250g"
    },
    colors: [
      { name: "Black", hex: "#1a1a2e" },
      { name: "White Smoke", hex: "#f5f0e8" },
      { name: "Sandstone", hex: "#d4a574" }
    ],
    rating: 4.8,
    reviews: 1200,
    inStock: true,
    featured: false,
    section: "accessories",
    image: "assets/BOSE QuietComfort Ultra.png"
  },
  {
    id: 26,
    name: "MagSafe Charger Stand",
    brand: "Apple",
    category: "Accessories",
    price: 49.00,
    originalPrice: null,
    discount: 0,
    description: "Apple MagSafe Charger Stand — 15W wireless charging for iPhone, perfectly aligned with magnets. Includes USB-C cable.",
    specs: {
      display: "—",
      processor: "—",
      ram: "—",
      storage: ["—"],
      camera: "—",
      battery: "—",
      os: "MagSafe, Qi2",
      weight: "55g"
    },
    colors: [
      { name: "White", hex: "#f5f5f5" }
    ],
    rating: 4.5,
    reviews: 810,
    inStock: true,
    featured: false,
    section: "accessories",
    image: "assets/placeholder.svg"
  },

  // ─── SECONDHAND ───────────────────────────────────────────
  {
    id: 27,
    name: "iPhone 13 Pro (Used)",
    brand: "Apple",
    category: "SecondHand",
    price: 399.00,
    originalPrice: 999.00,
    discount: 600,
    description: "Pre-owned iPhone 13 Pro in excellent condition. A15 Bionic chip, 6.1-inch ProMotion display, triple camera. Battery health 87%.",
    specs: {
      display: '6.1" OLED, 120Hz ProMotion',
      processor: "A15 Bionic",
      ram: "6GB",
      storage: ["128GB"],
      camera: "12MP Triple Camera",
      battery: "3095 mAh (87% health)",
      os: "iOS 18",
      weight: "204g"
    },
    colors: [
      { name: "Graphite", hex: "#2c2c2e" }
    ],
    rating: 4.2,
    reviews: 45,
    inStock: true,
    featured: false,
    section: "secondhand",
    image: "assets/iPhone 13 Pro (Used).jpg"
  },
  {
    id: 28,
    name: "Samsung Galaxy S23 (Used)",
    brand: "Samsung",
    category: "SecondHand",
    price: 329.00,
    originalPrice: 799.00,
    discount: 470,
    description: "Pre-owned Galaxy S23 in great condition. Snapdragon 8 Gen 2, 6.1-inch Dynamic AMOLED, 50MP camera. Battery health 91%.",
    specs: {
      display: '6.1" Dynamic AMOLED, 120Hz',
      processor: "Snapdragon 8 Gen 2",
      ram: "8GB",
      storage: ["128GB"],
      camera: "50MP Main + 12MP Ultra Wide + 10MP 3x",
      battery: "3900 mAh (91% health)",
      os: "Android 15, One UI 7",
      weight: "168g"
    },
    colors: [
      { name: "Phantom Black", hex: "#1a1a2e" }
    ],
    rating: 4.3,
    reviews: 32,
    inStock: true,
    featured: false,
    section: "secondhand",
    image: "assets/Samsung Galaxy S23 (Used).jpg"
  },
  {
    id: 29,
    name: "Google Pixel 8 (Used)",
    brand: "Google",
    category: "SecondHand",
    price: 299.00,
    originalPrice: 699.00,
    discount: 400,
    description: "Pre-owned Google Pixel 8 with Tensor G3 chip, 6.2-inch OLED, incredible camera with AI features. Battery health 93%.",
    specs: {
      display: '6.2" OLED, 120Hz',
      processor: "Google Tensor G3",
      ram: "8GB",
      storage: ["128GB"],
      camera: "50MP Main + 12MP Ultra Wide",
      battery: "4575 mAh (93% health)",
      os: "Android 16",
      weight: "187g"
    },
    colors: [
      { name: "Obsidian", hex: "#2c2c2e" }
    ],
    rating: 4.4,
    reviews: 28,
    inStock: true,
    featured: false,
    section: "secondhand",
    image: "assets/Google Pixel 8 (Used).jpg"
  },
  {
    id: 30,
    name: "iPhone 14 (Used)",
    brand: "Apple",
    category: "SecondHand",
    price: 449.00,
    originalPrice: 799.00,
    discount: 350,
    description: "Pre-owned iPhone 14 in mint condition. A15 Bionic, 6.1-inch Super Retina XDR OLED, dual 12MP camera. Battery health 90%.",
    specs: {
      display: '6.1" Super Retina XDR OLED',
      processor: "A15 Bionic",
      ram: "6GB",
      storage: ["128GB"],
      camera: "12MP Main + 12MP Ultra Wide",
      battery: "3279 mAh (90% health)",
      os: "iOS 18",
      weight: "172g"
    },
    colors: [
      { name: "Midnight", hex: "#1a1a2e" }
    ],
    rating: 4.3,
    reviews: 38,
    inStock: true,
    featured: false,
    section: "secondhand",
    image: "assets/iPhone 14 (Used).jpg"
  },

  // ─── EXTRA PHONES ─────────────────────────────────────────
  {
    id: 31,
    name: "Xiaomi 15 Ultra",
    brand: "Xiaomi",
    category: "Mobile Phone",
    price: 1099.00,
    originalPrice: 1299.00,
    discount: 200,
    description: "Xiaomi 15 Ultra with Leica Summilux camera system, Snapdragon 8 Elite, 6.73-inch LTPO AMOLED, and 5500mAh battery.",
    specs: {
      display: '6.73" LTPO AMOLED, 120Hz',
      processor: "Snapdragon 8 Elite",
      ram: "16GB",
      storage: ["256GB", "512GB"],
      camera: "50MP Main + 50MP Ultra Wide + 50MP 5x Periscope",
      battery: "5500 mAh",
      os: "Android 15, HyperOS 2",
      weight: "229g"
    },
    colors: [
      { name: "Black", hex: "#1a1a2e" },
      { name: "White", hex: "#f5f5f5" }
    ],
    rating: 4.7,
    reviews: 280,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/Xiaomi 15 Ultra.jpg"
  },
  {
    id: 32,
    name: "HUAWEI Pura 80 Pro",
    brand: "Huawei",
    category: "Mobile Phone",
    price: 1299.00,
    originalPrice: null,
    discount: 0,
    description: "HUAWEI Pura 80 Pro with XMAGE camera system, Kirin 9020 chip, 6.8-inch LTPO OLED, and satellite communication.",
    specs: {
      display: '6.8" LTPO OLED, 120Hz',
      processor: "Kirin 9020",
      ram: "16GB",
      storage: ["256GB", "512GB", "1TB"],
      camera: "50MP Main + 40MP Ultra Wide + 48MP 3.5x Periscope",
      battery: "5600 mAh",
      os: "HarmonyOS 5",
      weight: "220g"
    },
    colors: [
      { name: "Jade Green", hex: "#5a8f7a" },
      { name: "Obsidian Black", hex: "#1a1a2e" }
    ],
    rating: 4.6,
    reviews: 190,
    inStock: true,
    featured: false,
    section: "new-arrival",
    image: "assets/HUAWEI Pura 80 Pro.jpg"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRODUCTS;
}

// ─── BRAND LIST ──────────────────────────────────────────────
const BRANDS = [
  { name: "Apple",    icon: "fab fa-apple",    image: "assets/brands/Apple.png" },
  { name: "Samsung",  icon: null,              image: "assets/brands/Samsung.png" },
  { name: "Sony",     icon: null,              image: "assets/brands/Sony.png" },
  { name: "Xiaomi",   icon: null,              image: "assets/brands/Xiaomi.png" },
  { name: "Huawei",   icon: null,              image: "assets/brands/Huawei.png" },
  { name: "OPPO",     icon: null,              image: "assets/brands/OPPO.png" },
  { name: "Google",   icon: "fab fa-google",   image: "assets/brands/Google.png" },
  { name: "Infinix",  icon: null,              image: "assets/brands/Infinix.png" },
  { name: "HMD",      icon: null,              image: "assets/brands/HMD.png" },
  { name: "HONOR",    icon: null,              image: "assets/brands/Honor.png" },
  { name: "vivo",     icon: null,              image: "assets/brands/Vivo.png" },
  { name: "TECNO",    icon: null,              image: "assets/brands/Tecno.png" },
  { name: "Nothing",  icon: null,              image: "assets/brands/Nothing.png" },
  { name: "OnePlus",  icon: null,              image: "assets/brands/OnePlus.png" },
  { name: "Microsoft", icon: "fab fa-microsoft", image: null },
  { name: "Motorola", icon: null,              image: null },
  { name: "Lenovo",   icon: null,              image: null },
  { name: "Garmin",   icon: null,              image: null },
  { name: "COROS",    icon: null,              image: null },
  { name: "JBL",      icon: null,              image: null },
  { name: "BOSE",     icon: null,              image: null },
  { name: "REMAX",    icon: null,              image: null },
  { name: "Mcdodo",   icon: null,              image: null },
  { name: "Realme",   icon: null,              image: null }
];

// ─── CATEGORIES ──────────────────────────────────────────────
const CATEGORIES = [
  { name: "Mobile Phone", icon: "fas fa-mobile-alt", desc: "Latest smartphones" },
  { name: "Smart Watch", icon: "fas fa-clock", desc: "Smartwatches & bands" },
  { name: "Accessories", icon: "fas fa-headphones", desc: "Earbuds, chargers & more" },
  { name: "SecondHand", icon: "fas fa-recycle", desc: "Pre-owned devices" }
];
