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
      image TEXT,
      stock INTEGER DEFAULT 0
    )`);

    // Add stock column if missing (for existing tables)
    try { await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0`); } catch(e) {}

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
      "createdAt" TEXT,
      "approvedBy" TEXT,
      "approvedAt" TEXT
    )`);

    // Add approved columns if missing
    try { await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS "approvedBy" TEXT`); } catch(e) {}
    try { await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS "approvedAt" TEXT`); } catch(e) {}

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
        await pool.query(`INSERT INTO users (id, "firstName", "lastName", email, password, role, "createdAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [u.id, u.firstName, u.lastName, u.email, u.password, u.role, new Date().toISOString()]);
        console.log('Seeded', u.email);
      }
    }

    // Seed Super Admin User
    const superAdminRes = await pool.query("SELECT * FROM users WHERE email = 'super@shopflow.com'");
    if (superAdminRes.rows.length === 0) {
      await pool.query(`INSERT INTO users (id, "firstName", "lastName", email, password, role, "createdAt")
              VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        ['super-001', 'Super', 'Admin', 'super@shopflow.com', 'super123', 'super_admin', new Date().toISOString()]);
      console.log('Seeded Super Admin User');
    }
  } catch (err) {
    console.error("Database initialization error:", err);
  }
};

initDb();

module.exports = pool;
