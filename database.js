require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
});

const initDb = async () => {
  try {
    // Create Users Table
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      "createdAt" TEXT
    )`);

    // Create Products Table
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

    // Create Orders Table
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

    // Create Order Items Table
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

    // Seed Initial Admin User
    const adminRes = await pool.query("SELECT * FROM users WHERE email = 'admin@shopflow.com'");
    if (adminRes.rows.length === 0) {
      await pool.query(`INSERT INTO users (id, "firstName", "lastName", email, password, role, "createdAt")
              VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        ['admin-001', 'Admin', 'ShopFlow', 'admin@shopflow.com', 'admin123', 'admin', new Date().toISOString()]);
      console.log('Seeded Admin User');
    }
  } catch (err) {
    console.error("Database initialization error:", err);
  }
};

initDb();

module.exports = pool;
