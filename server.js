require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const pool = require('./database');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Multer config for payment screenshots (cloud storage)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'shopflow/payments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));

// ==========================================
// API ROUTES
// ==========================================

// ─── ADMIN ANALYTICS API ────────────────────────
app.get('/api/admin/analytics/revenue', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE("createdAt") as date, SUM(total) as revenue
      FROM orders
      GROUP BY date
      ORDER BY date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/analytics/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.category, COUNT(oi.id) as count
      FROM order_items oi
      JOIN products p ON oi."productId" = p.id
      GROUP BY p.category
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TODAY'S SALES ANALYTICS ────────────────────
app.get('/api/admin/analytics/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(`
      SELECT 
        COUNT(*)::int as order_count,
        COALESCE(SUM(total), 0) as total_revenue,
        COALESCE(AVG(total), 0) as avg_order_value
      FROM orders
      WHERE DATE("createdAt") = $1
    `, [today]);

    const pendingRes = await pool.query(`
      SELECT COUNT(*)::int as count FROM orders WHERE status = 'Processing'
    `);

    const totalRes = await pool.query(`
      SELECT 
        COUNT(*)::int as total_orders,
        COALESCE(SUM(total), 0) as lifetime_revenue
      FROM orders
    `);

    res.json({
      today: {
        orderCount: parseInt(result.rows[0].order_count),
        totalRevenue: parseFloat(result.rows[0].total_revenue),
        avgOrderValue: parseFloat(result.rows[0].avg_order_value),
        estimatedProfit: parseFloat((result.rows[0].total_revenue * 0.3).toFixed(2))
      },
      pending: parseInt(pendingRes.rows[0].count),
      lifetime: {
        totalOrders: parseInt(totalRes.rows[0].total_orders),
        totalRevenue: parseFloat(totalRes.rows[0].lifetime_revenue)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── SUPER ADMIN: MANAGE ADMINS ──────────────
app.get('/api/admin/users/admins', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, "firstName", "lastName", email, role, "createdAt" FROM users WHERE role IN ('admin', 'superadmin')`
    );
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id/role', async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'admin', 'superadmin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  try {
    await pool.query(`UPDATE users SET role = $1 WHERE id = $2`, [role, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/admin/admins', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const id = 'admin-' + Date.now();
  const createdAt = new Date().toISOString();
  const userRole = role || 'admin';

  try {
    await pool.query(
      `INSERT INTO users (id, "firstName", "lastName", email, password, role, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, firstName, lastName, email.toLowerCase(), password, userRole, createdAt]
    );
    res.json({ success: true, user: { id, firstName, lastName, email: email.toLowerCase(), role: userRole } });
  } catch (err) {
    if (err.message.includes('unique constraint')) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

// ─── USERS API ────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const id = 'user-' + Date.now();
  const createdAt = new Date().toISOString();

  try {
    await pool.query(
      `INSERT INTO users (id, "firstName", "lastName", email, password, "createdAt") VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, firstName, lastName, email.toLowerCase(), password, createdAt]
    );
    res.json({ success: true, user: { id, firstName, lastName, email: email.toLowerCase(), role: 'customer' } });
  } catch (err) {
    if (err.message.includes('unique constraint')) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT id, "firstName", "lastName", email, role FROM users WHERE email = $1 AND password = $2`,
      [email.toLowerCase(), password]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Database error.' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, "firstName", "lastName", email, password, role, "createdAt" FROM users`);
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    await pool.query(
      `UPDATE users SET "firstName" = $1, "lastName" = $2, email = $3, password = $4, role = $5 WHERE id = $6`,
      [firstName, lastName, email.toLowerCase(), password, role, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PRODUCTS API ─────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products`);

    // Parse JSON strings back to objects/arrays
    const products = result.rows.map(p => ({
      ...p,
      specs: p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : {},
      colors: p.colors ? (typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors) : [],
      inStock: (p.stock || 0) > 0,
      featured: p.featured === true || p.featured === 1,
      originalPrice: p.originalPrice || null
    }));
    res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM products WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const row = result.rows[0];
    row.specs = row.specs ? (typeof row.specs === 'string' ? JSON.parse(row.specs) : row.specs) : {};
    row.colors = row.colors ? (typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors) : [];
    row.inStock = (row.stock || 0) > 0;
    row.featured = row.featured === true || row.featured === 1;
    row.originalPrice = row.originalPrice || null;
    res.json(row);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Product Management (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const { name, brand, category, price, originalPrice, discount, description, specs, colors, rating, reviews, inStock, featured, section, image } = req.body;

    // Get max ID to increment
    const idRes = await pool.query(`SELECT MAX(id) as max_id FROM products`);
    const newId = (idRes.rows[0].max_id || 0) + 1;

    await pool.query(`
      INSERT INTO products (id, name, brand, category, price, "originalPrice", discount, description, specs, colors, rating, reviews, "inStock", featured, section, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [newId, name, brand, category, price, originalPrice || null, discount || 0, description, JSON.stringify(specs || {}), JSON.stringify(colors || []), rating || 0, reviews || 0, inStock || true, featured || false, section || null, image || 'assets/placeholder.png']
    );
    res.json({ success: true, id: newId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { name, brand, category, price, originalPrice, discount, description, specs, colors, rating, reviews, inStock, featured, section, image } = req.body;
    await pool.query(`
      UPDATE products SET
        name = $1, brand = $2, category = $3, price = $4, "originalPrice" = $5, discount = $6,
        description = $7, specs = $8, colors = $9, rating = $10, reviews = $11, "inStock" = $12,
        featured = $13, section = $14, image = $15
      WHERE id = $16`,
      [name, brand, category, price, originalPrice, discount, description, JSON.stringify(specs || {}), JSON.stringify(colors || []), rating, reviews, inStock, featured, section, image, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── ORDERS API ───────────────────────────
app.post('/api/orders', upload.single('paymentScreenshot'), async (req, res) => {
  const { userId, customerName, customerEmail, subtotal, tax, shipping, total, shippingInfo, items } = req.body;
  const paymentScreenshot = req.file ? req.file.path : null;
  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
  const createdAt = new Date().toISOString();
  const status = 'Processing';

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Insert order
    await client.query(`
      INSERT INTO orders (id, "userId", "customerName", "customerEmail", subtotal, tax, shipping, total, "shippingInfo", "paymentScreenshot", status, "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [orderId, userId, customerName, customerEmail, subtotal, tax, shipping, total, shippingInfo, paymentScreenshot, status, createdAt]
    );

    // Insert order items
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    for (const item of parsedItems) {
      await client.query(`
        INSERT INTO order_items ("orderId", "productId", name, price, quantity, "selectedColor", "selectedStorage")
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, item.productId, item.name, item.price, item.quantity, item.selectedColor, item.selectedStorage]
      );
      // Decrement stock
      await client.query(`UPDATE products SET stock = stock - $1 WHERE id = $2`, [item.quantity, item.productId]);
    }

    await client.query('COMMIT');
    res.json({ success: true, order: { id: orderId } });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ success: false, message: 'Failed to place order' });
  } finally {
    client.release();
  }
});

app.get('/api/orders', async (req, res) => {
  const userId = req.query.userId;
  let query = `SELECT * FROM orders`;
  let params = [];
  
  if (userId) {
    query += ` WHERE "userId" = $1`;
    params.push(userId);
  }
  query += ` ORDER BY "createdAt" DESC`;

  try {
    const ordersRes = await pool.query(query, params);
    const orders = ordersRes.rows;

    if (orders.length === 0) return res.json([]);

    // Fetch items for each order
    for (const order of orders) {
      order.shippingInfo = order.shippingInfo ? (typeof order.shippingInfo === 'string' ? JSON.parse(order.shippingInfo) : order.shippingInfo) : {};
      const itemsRes = await pool.query(`SELECT * FROM order_items WHERE "orderId" = $1`, [order.id]);
      order.items = itemsRes.rows || [];
    }
    
    res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1`, [req.params.id]);
    if (orderRes.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    const order = orderRes.rows[0];
    order.shippingInfo = order.shippingInfo ? (typeof order.shippingInfo === 'string' ? JSON.parse(order.shippingInfo) : order.shippingInfo) : {};
    
    const itemsRes = await pool.query(`SELECT * FROM order_items WHERE "orderId" = $1`, [order.id]);
    order.items = itemsRes.rows || [];
    
    res.json(order);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { status, adminId } = req.body;
  console.log(`[STATUS] order=${req.params.id} status=${status} adminId=${JSON.stringify(adminId)} bodyKeys=${Object.keys(req.body).join(',')}`);
  try {
    if (status === 'Completed') {
      // Track which admin approved (stock already decremented at order placement)
      const approvedVal = adminId || 'unknown';
      console.log(`[STATUS] Setting approvedBy to: "${approvedVal}"`);
      const updRes = await pool.query(`UPDATE orders SET status = $1, "approvedBy" = $2, "approvedAt" = $3 WHERE id = $4`,
        [status, approvedVal, new Date().toISOString(), req.params.id]);
      console.log(`[STATUS] Updated ${updRes.rowCount} rows`);
      const checkRes = await pool.query(`SELECT status, "approvedBy" FROM orders WHERE id = $1`, [req.params.id]);
      console.log(`[STATUS] After update: status=${checkRes.rows[0]?.status} approvedBy=${checkRes.rows[0]?.approvedBy}`);
    } else {
      // Undo — just revert status (stock stays decremented from placement)
      await pool.query(`UPDATE orders SET status = $1, "approvedBy" = NULL, "approvedAt" = NULL WHERE id = $2`,
        [status, req.params.id]);
    }
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    // Restore stock before deleting
    const itemsRes = await pool.query(`SELECT * FROM order_items WHERE "orderId" = $1`, [req.params.id]);
    for (const item of itemsRes.rows) {
      await pool.query(`UPDATE products SET stock = stock + $1 WHERE id = $2`, [item.quantity, item.productId]);
    }
    await pool.query(`DELETE FROM order_items WHERE "orderId" = $1`, [req.params.id]);
    await pool.query(`DELETE FROM orders WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ─── STOCK MANAGEMENT ───────────────────────────
app.put('/api/admin/stock/:id', async (req, res) => {
  const { amount } = req.body;
  try {
    await pool.query(`UPDATE products SET stock = stock + $1 WHERE id = $2`, [amount, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── ADVANCED ANALYTICS ────────────────────────
app.get('/api/admin/analytics/summary', async (req, res) => {
  const { period, adminId } = req.query; // period: day, week, month, year
  let dateFilter = '';
  const now = new Date();
  if (period === 'day') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    dateFilter = ` AND o."createdAt" >= '${start}'`;
  } else if (period === 'week') {
    const d = new Date(now); d.setDate(d.getDate() - d.getDay());
    dateFilter = ` AND o."createdAt" >= '${d.toISOString()}'`;
  } else if (period === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    dateFilter = ` AND o."createdAt" >= '${start}'`;
  } else if (period === 'year') {
    const start = new Date(now.getFullYear(), 0, 1).toISOString();
    dateFilter = ` AND o."createdAt" >= '${start}'`;
  }

  const adminFilter = adminId ? ` AND o."approvedBy" = '${adminId}'` : '';

  try {
    const countRes = await pool.query(`
      SELECT COUNT(DISTINCT o.id) as count
      FROM orders o
      JOIN order_items oi ON oi."orderId" = o.id
      WHERE o.status = 'Completed'${dateFilter}${adminFilter}
    `);

    const salesRes = await pool.query(`
      SELECT COALESCE(SUM(oi.quantity), 0) as "productsSold",
             COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM orders o
      JOIN order_items oi ON oi."orderId" = o.id
      WHERE o.status = 'Completed'${dateFilter}${adminFilter}
    `);

    const brandRes = await pool.query(`
      SELECT p.brand, COALESCE(SUM(oi.quantity), 0) as count, COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM orders o
      JOIN order_items oi ON oi."orderId" = o.id
      JOIN products p ON p.id = oi."productId"
      WHERE o.status = 'Completed'${dateFilter}${adminFilter}
      GROUP BY p.brand ORDER BY revenue DESC
    `);

    const productRes = await pool.query(`
      SELECT oi.name, COALESCE(SUM(oi.quantity), 0) as count, COALESCE(SUM(oi.quantity * oi.price), 0) as revenue
      FROM orders o
      JOIN order_items oi ON oi."orderId" = o.id
      WHERE o.status = 'Completed'${dateFilter}${adminFilter}
      GROUP BY oi.name ORDER BY count DESC
    `);

    res.json({
      productsSold: parseInt(salesRes.rows[0].productsSold),
      revenue: parseFloat(salesRes.rows[0].revenue),
      orderCount: parseInt(countRes.rows[0].count),
      salesByBrand: brandRes.rows,
      salesByProduct: productRes.rows
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── STOCK ──────────────────────────────────────
app.get('/api/admin/stock', async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, name, brand, category, stock, price FROM products ORDER BY name`);
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─── SUPERADMIN ─────────────────────────────────
app.get('/api/superadmin/admins', async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, "firstName", "lastName", email, role, "createdAt" FROM users WHERE role = 'admin' ORDER BY email`);
    res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/superadmin/approvals', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.id, o."approvedBy", o."approvedAt", o."createdAt", o.total, o.status,
             o."paymentScreenshot", o."customerName",
             u."firstName" || ' ' || u."lastName" as "userName",
             adm."firstName" || ' ' || adm."lastName" as "approverName"
      FROM orders o
      LEFT JOIN users u ON u.id = o."userId"
      LEFT JOIN users adm ON adm.email = o."approvedBy"
      ORDER BY o."createdAt" DESC
    `);
    const orders = result.rows;
    for (const order of orders) {
      const itemsRes = await pool.query(`SELECT name, quantity, price FROM order_items WHERE "orderId" = $1`, [order.id]);
      order.items = itemsRes.rows;
    }
    res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/superadmin/approvals/:id/disapprove', async (req, res) => {
  try {
    const orderRes = await pool.query(`SELECT * FROM orders WHERE id = $1`, [req.params.id]);
    if (orderRes.rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
    const order = orderRes.rows[0];
    if (order.status !== 'Completed') return res.status(400).json({ success: false, message: 'Order is not completed' });

    // Increment stock back
    const itemsRes = await pool.query(`SELECT * FROM order_items WHERE "orderId" = $1`, [req.params.id]);
    for (const item of itemsRes.rows) {
      await pool.query(`UPDATE products SET stock = stock + $1 WHERE id = $2`, [item.quantity, item.productId]);
    }
    await pool.query(`UPDATE orders SET status = 'Processing', "approvedBy" = NULL, "approvedAt" = NULL WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for frontend routing (if needed)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'API route not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
