# ShopFlow

> A full-stack electronics e-commerce platform with admin panel, payment upload, and a premium dark UI.

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-8A2BE2)

---

## Features

- **Product Catalog** — Browse electronics with live search, category/brand filters, and price range
- **Shopping Cart** — Add/remove items, persistent across sessions
- **Checkout** — Upload payment screenshot as proof of payment
- **Order Confirmation** — Full shipping & order summary after purchase
- **Admin Dashboard** — Stats, charts, order management with status toggle
- **File Upload** — Payment screenshots stored server-side for admin verification
- **Scroll Reveal** — Smooth entrance animations as you scroll
- **Dark Theme** — Purple gradient accents throughout

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| Frontend | HTML5, CSS3, Vanilla JS |
| Database | PostgreSQL |
| File Upload | Multer |
| Charts | Chart.js |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 16

### Installation

```bash
# Clone the repo
git clone https://github.com/ThearaGithub/Online-Shop-System.git
cd Online-Shop-System

# Install dependencies
npm install

# Create database
createdb shopflow

# Start the server
node server.js
```

The app runs at `http://localhost:3000`.

### Admin Login

| Email | Password |
|-------|----------|
| `admin@shopflow.com` | `admin123` |

---

## Project Structure

```
├── assets/              # Product images & placeholder.svg
├── css/
│   └── style.css        # All styles (3010 lines)
├── js/
│   ├── app.js           # Auth, cart, orders, scroll reveal
│   ├── admin.js         # Dashboard, charts, order management
│   ├── homepage.js      # Carousel, product sections, brands
│   ├── products.js      # Listing with filters & sorting
│   ├── products-data.js # Static product catalog
│   ├── checkout.js      # Payment & shipping form
│   └── product-detail.js# Single product view
├── uploads/             # Payment screenshots (gitignored)
├── server.js            # Express routes + multer config
├── database.js          # DB pool + table init
├── *.html               # All pages (11 files)
└── package.json
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/orders` | Place order (multipart) |
| GET | `/api/orders` | User's orders |
| GET | `/api/admin/orders` | All orders (admin) |
| PUT | `/api/admin/orders/:id` | Update order status |
| GET | `/api/admin/stats` | Dashboard stats |

---

## Screenshots

*(Add screenshots of your app here)*

```
![Homepage](./screenshots/homepage.png)
![Admin Dashboard](./screenshots/admin.png)
```

---

## License

MIT
