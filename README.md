# ShopFlow

> Full-stack electronics e-commerce platform — browse, cart, checkout with payment screenshot upload, reviews, wishlist, price-drop notifications, and multi-tier admin panel.

![Node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?logo=render&logoColor=white)

---

## Live Demo

[https://online-shop-system-puod.onrender.com](https://online-shop-system-puod.onrender.com)

### Logins

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `superadmin@shopflow.com` | `superadmin123` |
| Admin | `admin@shopflow.com` | `admin123` |
| Admin A | `admin-a@shopflow.com` | `admin123` |
| Admin B | `admin-b@shopflow.com` | `admin123` |
| Admin C | `admin-c@shopflow.com` | `admin123` |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | HTML5, CSS3, Vanilla JS | Page structure, styling, browser logic |
| Backend | Node.js + Express | API routes, static serving, file processing |
| Database | PostgreSQL (Neon cloud) | Users, products, orders, reviews |
| Image Storage | Cloudinary | Product images, payment screenshots, avatars |
| Charts | Chart.js | Revenue trend & category sales on admin dashboard |
| Hosting | Render | Auto-deploys from GitHub on push |

---

## Features

### Customer
- Product catalog with **multi-filters**: category, brand, price range (with out-of-range warnings), rating radios, screen size checkboxes, color checkboxes, availability toggles
- **Collapsible filter dropdowns** with Expand All / Collapse All
- Product detail page with specs, color/thumbnail switching, stock display
- **Reviews & ratings** — star picker, comment, edit/delete per card, auto-calculated average rating
- Shopping cart with localStorage persistence and **discount calculation**
- Checkout with **payment screenshot upload** to Cloudinary
- **Wishlist** with heart icon on cards/detail page + dedicated wishlist page
- **In-app price-drop notifications** — bell icon with badge count, wishlist discounts + hot deals
- **Related products** — same brand first (closest price), fallback to same-category
- **Profile editing** — name, avatar upload (Cloudinary), phone, delivery address
- **Order history** tracking with status
- Dark/light theme toggle
- Fully mobile responsive with hamburger menu
- Loading skeletons, scroll reveal animations, card hover effects

### Admin
- Dashboard with total orders, revenue, pending count, registered customers
- Revenue trend line chart + category sales doughnut chart
- Product management (Add/Edit/Delete) with stock tracking
- Stock management (+1/-1/+3/+5/+10/+100 buttons)
- Orders table — customer, items, shipping, payment screenshot, approve/complete/delete
- User management (edit/delete) with avatar display

### Super Admin
- All admin capabilities
- Admin account management (CRUD) with avatar column
- Product approvals (approve/disapprove per admin)
- Today's sales board
- Period stats cards with average order value

### UI/UX
- Premium dark-theme design with light mode option
- Hero carousel with floating & hover animations
- Frosted glass header/nav/dropdowns
- Card hover effects (lift, glow, image scale)
- Scroll-to-top button
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
│   └── style.css        # All styles (~3800 lines)
├── js/
│   ├── app.js           # Auth, cart, orders, header/footer, theme, notifications
│   ├── admin.js         # Dashboard, charts, order/user/product management
│   ├── superadmin.js    # Super admin panel (admin CRUD, approvals, stock)
│   ├── auth.js          # Login/signup form logic, password toggle
│   ├── homepage.js      # Carousel, featured sections, brands
│   ├── products.js      # Product listing with multi-filters
│   ├── products-data.js # Static product catalog (30 products)
│   ├── product-detail.js# Single product view, reviews, related products
│   ├── cart.js          # Cart page rendering
│   ├── checkout.js      # Checkout form + file upload + discount display
│   ├── profile.js       # Profile editing with avatar, phone, address
│   ├── wishlist.js      # Wishlist page with add-to-cart + remove
│   ├── contact.js       # Contact page
│   └── orders.js        # Order history page
├── server.js            # Express routes, multer, Cloudinary storage, all API endpoints
├── database.js          # PostgreSQL pool, table creation, seeds, migrations
├── *.html               # 16+ pages
└── package.json
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile (avatar, address, phone) |
| GET | `/api/products` | All products (with search, category, brand, sort) |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (superadmin) |
| POST | `/api/products/upload-image` | Upload image to Cloudinary |
| GET | `/api/products/check-price-drops` | Check wishlist price drops |
| GET | `/api/products/hot-deals` | Hot deals (discounted products) |
| GET | `/api/reviews/:productId` | Get reviews for product |
| POST | `/api/reviews` | Add review |
| PUT | `/api/reviews/:id` | Edit review |
| DELETE | `/api/reviews/:id` | Delete review |
| POST | `/api/orders` | Place order (multipart/form-data) |
| GET | `/api/orders` | All orders or by userId |
| PUT | `/api/orders/:id/status` | Update order status |
| DELETE | `/api/orders/:id` | Delete order (admin) |
| GET | `/api/admin/users` | List users |
| PUT | `/api/admin/users/:id` | Edit user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/analytics/revenue` | Revenue trend data |
| GET | `/api/admin/analytics/categories` | Category sales data |
| GET | `/api/admin/analytics/products-sold` | Products sold data |
| GET | `/api/admin/analytics/period-stats` | Period statistics |

---

## Database Tables

| Table | Key Columns |
|-------|-------------|
| **users** | id, firstName, lastName, email, password, role, createdAt, avatar, address, phone |
| **products** | id, name, brand, category, price, originalPrice, discount, description, specs, colors, rating, reviews, inStock, featured, section, image, stock |
| **reviews** | id, productId, userId, userName, avatar, rating, comment, createdAt, updatedAt |
| **orders** | id, userId, customerName, customerEmail, subtotal, tax, shipping, total, shippingInfo, paymentScreenshot, status, createdAt, approvedBy, approvedAt |
| **order_items** | id, orderId, productId, name, price, quantity, selectedColor, selectedStorage |

---

## Team

| Member | Role |
|--------|------|
| Theara | Lead Developer (full-stack, backend, database, deployment) |
| Youpheng | Dashboard Developer (super admin dashboard, sales board) |
| Khann | Content & Documentation (privacy policy, documentation) |
| Sivchheng | Content & Support (payment guide, support docs) |
| Chea | SEO & Infrastructure (meta tags, sitemap, site guide) |

---

## License

MIT
