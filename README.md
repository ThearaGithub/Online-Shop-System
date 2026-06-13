# ShopFlow

> Full-stack electronics e-commerce platform — browse products, cart, checkout with payment screenshot upload, and admin dashboard.

![Node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-8A2BE2)

---

## Live Demo

[https://online-shop-system-puod.onrender.com](https://online-shop-system-puod.onrender.com)

### Admin Login
| Email | Password |
|-------|----------|
| `admin@shopflow.com` | `admin123` |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | HTML5, CSS3, Vanilla JS | Page structure, styling, browser logic |
| Backend | Node.js + Express | API routes, static serving, file processing |
| Database | PostgreSQL (Neon cloud) | Users, products, orders, order items |
| Image Storage | Cloudinary | Payment screenshots (persist across restarts) |
| Charts | Chart.js | Revenue trend & category sales on admin dashboard |
| Hosting | Render | Auto-deploys from GitHub on push |

---

## Features

### Customer
- Product catalog with search, filter by category/brand, sort
- Product detail page with specs, colors, storage options
- Shopping cart with localStorage persistence
- Checkout with payment screenshot upload
- Order history tracking
- Dark/light theme toggle
- Fully mobile responsive with hamburger menu

### Admin
- Dashboard with total orders, revenue, pending count, registered customers
- Revenue trend line chart + category sales doughnut chart
- Orders table — see customer, items purchased (product name × quantity + options), shipping, payment screenshot thumbnail
- Complete/Undo order status, Delete orders
- User management (edit/delete)

### UI/UX
- Hero carousel with floating & hover animations
- Loading skeletons on all data-driven pages
- Scroll reveal animations (categories, brands)
- Card hover effects (lift, glow, image scale)
- Frosted glass header/nav/dropdowns
- Password show/hide toggle on auth forms

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or Neon)

### Installation

```bash
git clone https://github.com/ThearaGithub/Online-Shop-System.git
cd Online-Shop-System
npm install
```

### Environment Variables (.env)

```env
DATABASE_URL=postgresql://user:password@host:5432/shopflow
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

### Run

```bash
node server.js
```

App runs at `http://localhost:3000`.

---

## Project Structure

```
├── assets/              # Product images
├── css/
│   └── style.css        # All styles (~3200 lines)
├── js/
│   ├── app.js           # Auth, cart, orders, header/footer, theme, scroll reveal
│   ├── admin.js         # Dashboard, charts, order/user management
│   ├── auth.js          # Login/signup form logic, password toggle
│   ├── homepage.js      # Carousel, featured sections, brands
│   ├── cart.js          # Cart page rendering
│   ├── checkout.js      # Checkout form + file upload
│   ├── products-data.js # Static product catalog
│   ├── products.js      # Product listing with filters
│   └── product-detail.js# Single product view
├── server.js            # Express routes, multer, Cloudinary storage
├── database.js          # PostgreSQL pool, table creation, admin seed
├── *.html               # 11 pages (index, products, cart, checkout, etc.)
└── package.json
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | All products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Place order (multipart/form-data) |
| GET | `/api/orders` | All orders or by userId |
| GET | `/api/orders/:id` | Single order |
| PUT | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Delete order (admin) |
| GET | `/api/admin/users` | List users |
| PUT | `/api/admin/users/:id` | Edit user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/analytics/revenue` | Revenue trend data |
| GET | `/api/admin/analytics/categories` | Category sales data |

---

## Database Tables

- **users** — id, firstName, lastName, email, password, role, createdAt
- **products** — id, name, brand, category, price, originalPrice, discount, description, specs, colors, rating, reviews, inStock, featured, section, image
- **orders** — id, userId, customerName, customerEmail, subtotal, tax, shipping, total, shippingInfo, paymentScreenshot, status, createdAt
- **order_items** — id, orderId, productId, name, price, quantity, selectedColor, selectedStorage

---

## Product Showcase

<p align="center">
  <img src="./assets/iPhone 17 Pro Max.png" width="120" alt="iPhone 17 Pro Max">
  <img src="./assets/Samsung Galaxy S26 Ultra.png" width="120" alt="Samsung Galaxy S26 Ultra">
  <img src="./assets/Google Pixel 10a.png" width="120" alt="Google Pixel 10a">
  <img src="./assets/Galaxy Buds 4.png" width="120" alt="Galaxy Buds 4">
  <img src="./assets/Nothing Phone (4a) Pro.png" width="120" alt="Nothing Phone (4a) Pro">
</p>
<p align="center">
  <img src="./assets/OPPO Find X9 Pro.png" width="120" alt="OPPO Find X9 Pro">
  <img src="./assets/HMD Watch P1.png" width="120" alt="HMD Watch P1">
  <img src="./assets/Fast Car Charger.png" width="120" alt="Fast Car Charger">
  <img src="./assets/Smart Band 10.png" width="120" alt="Smart Band 10">
  <img src="./assets/vivo V70 FE.png" width="120" alt="vivo V70 FE">
</p>

---

## License

MIT
