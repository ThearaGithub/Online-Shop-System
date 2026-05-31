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
    image TEXT
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
    "createdAt" TEXT
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

  // Seed Admin User
  const adminRes = await pool.query("SELECT * FROM users WHERE email = 'admin@shopflow.com'");
  if (adminRes.rows.length === 0) {
    await pool.query(`INSERT INTO users (id, "firstName", "lastName", email, password, role, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      ['admin-001', 'Admin', 'ShopFlow', 'admin@shopflow.com', 'admin123', 'admin', new Date().toISOString()]);
    console.log('Seeded Admin User');
  }


  console.log('Tables ready.');
  try {
    // Clear old product data
    await pool.query('DELETE FROM products');
    console.log('Cleared old products.');

    for (const p of PRODUCTS) {
      let image = p.image;
      if (!image || !image.startsWith('assets/')) {
        image = 'assets/placeholder.png'; // will trigger onerror fallback in UI
      }

      await pool.query(`
        INSERT INTO products 
          (id, name, brand, category, price, "originalPrice", discount, description, specs, colors, rating, reviews, "inStock", featured, section, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
          image = EXCLUDED.image
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
        image
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
