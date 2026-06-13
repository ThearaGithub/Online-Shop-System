// reseed.js — Wipe and re-seed products table with correct data
require('dotenv').config();
const { Pool } = require('pg');
const PRODUCTS = require('./js/products-data');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

console.log('Re-seeding products table...');

const reseed = async () => {
  // Create tables first (in case they don't exist yet)
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    "createdAt" TEXT
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    "originalPrice" REAL,
    discount REAL DEFAULT 0,
    description TEXT,
    specs TEXT,
    colors TEXT,
    rating REAL DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    "inStock" BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    section TEXT,
    image TEXT,
    stock INTEGER DEFAULT 0
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    subtotal REAL,
    tax REAL,
    shipping REAL,
    total REAL,
    "shippingInfo" TEXT,
    "paymentScreenshot" TEXT,
    status TEXT DEFAULT 'Processing',
    "createdAt" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TEXT
  )`);

  await pool.query(`CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    "selectedColor" TEXT,
    "selectedStorage" TEXT,
    FOREIGN KEY("orderId") REFERENCES orders(id)
  )`);

  // Seed Users
  const usersToSeed = [
    { id: 'admin-001', firstName: 'Admin', lastName: 'ShopFlow', email: 'admin@shopflow.com', password: 'admin123', role: 'admin' },
    { id: 'su-001', firstName: 'Super', lastName: 'Admin', email: 'superadmin@shopflow.com', password: 'superadmin123', role: 'superadmin' },
    { id: 'admin-a-001', firstName: 'Admin', lastName: 'A', email: 'admin-a@shopflow.com', password: 'admin123', role: 'admin' },
    { id: 'admin-b-001', firstName: 'Admin', lastName: 'B', email: 'admin-b@shopflow.com', password: 'admin123', role: 'admin' },
    { id: 'admin-c-001', firstName: 'Admin', lastName: 'C', email: 'admin-c@shopflow.com', password: 'admin123', role: 'admin' }
  ];
  for (const u of usersToSeed) {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [u.email]);
    if (existing.rows.length === 0) {
      await pool.query(`INSERT INTO users (id, "firstName", "lastName", email, password, role, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [u.id, u.firstName, u.lastName, u.email, u.password, u.role, new Date().toISOString()]);
      console.log('Seeded', u.email);
    }
  }


  console.log('Tables ready.');
  try {
    // Clear old product data
    await pool.query('DELETE FROM products');
    console.log('Cleared old products.');

    // Determine stock based on category
    const getStock = (category, brand) => {
      if (category === 'Mobile Phone') return 50;
      if (category === 'Laptop') return 25;
      if (category === 'TV') return 15;
      if (category === 'Audio') return 80;
      if (category === 'Wearable') return 60;
      if (category === 'Accessories') return 200;
      if (category === 'Camera') return 20;
      if (category === 'Gaming') return 30;
      if (category === 'Smart Home') return 40;
      if (category === 'Tablet') return 30;
      return 100;
    };

    for (const p of PRODUCTS) {
      let image = p.image;
      if (!image || !image.startsWith('assets/')) {
        image = 'assets/placeholder.png';
      }

      await pool.query(`
        INSERT INTO products 
          (id, name, brand, category, price, "originalPrice", discount, description, specs, colors, rating, reviews, "inStock", featured, section, image, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          brand = EXCLUDED.brand,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          "originalPrice" = EXCLUDED."originalPrice",
          discount = EXCLUDED.discount,
          description = EXCLUDED.description,
          specs = EXCLUDED.specs,
          colors = EXCLUDED.colors,
          rating = EXCLUDED.rating,
          reviews = EXCLUDED.reviews,
          "inStock" = EXCLUDED."inStock",
          featured = EXCLUDED.featured,
          section = EXCLUDED.section,
          image = EXCLUDED.image,
          stock = EXCLUDED.stock
      `, [
        p.id,
        p.name,
        p.brand,
        p.category,
        p.price,
        p.originalPrice || null,
        p.discount || 0,
        p.description,
        JSON.stringify(p.specs || {}),
        JSON.stringify(p.colors || []),
        p.rating,
        p.reviews,
        p.inStock ? true : false,
        p.featured ? true : false,
        p.section || null,
        image,
        p.stock !== undefined ? p.stock : getStock(p.category, p.brand)
      ]);
    }

    console.log(`✅ Successfully seeded ${PRODUCTS.length} products!`);
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    process.exit(0);
  }
};

reseed();
