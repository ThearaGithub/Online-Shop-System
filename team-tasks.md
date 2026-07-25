# Team Tasks — ShopFlow Group 3

## Rule: NO existing files touched. Only create new files.

Each person creates their own standalone HTML page + optional JS file.
The site's header & footer appear automatically because `js/app.js` is loaded.

After all pages are done, Theara does ONE final commit to add footer links.

---

## Khann Udomvirak — About Us Page

**Create:** `about.html` + `js/about.js`

### about.html content:
- Copy the `<head>` from `contact.html` (lines 1-10) — same styles, same favicon
- Change `<title>` to "About Us — ShopFlow"
- Page structure:
  ```
  <body>
    <!-- Header rendered by app.js -->
    <main class="main-content">
      <div class="page-title-bar">
        <h1>About Us</h1>
        <div class="breadcrumb">
          <a href="index.html">Home</a> <span>/</span> <span>About Us</span>
        </div>
      </div>

      <!-- Section 1: Company Story -->
      <div class="about-section" style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: var(--text-primary); margin-bottom: 20px;">Our Story</h2>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 16px;">
          ShopFlow was founded in 2026 with a simple mission: make premium electronics accessible to everyone. 
          What started as a university project quickly grew into a fully-functional e-commerce platform 
          built by students, for students.
        </p>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 16px;">
          We specialize in the latest smartphones, smartwatches, and tech accessories — 
          sourced from trusted brands and offered at competitive prices. Every product in our catalog 
          is carefully selected to ensure quality and value.
        </p>

        <h2 style="color: var(--text-primary); margin: 40px 0 20px;">Our Mission</h2>
        <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 16px;">
          To provide a seamless, secure, and enjoyable shopping experience for everyone. 
          We believe that great technology should be easy to find, easy to buy, and easy to love.
        </p>

        <h2 style="color: var(--text-primary); margin: 40px 0 20px;">Meet the Team</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
          <div style="background: var(--bg-tertiary); border-radius: 16px; padding: 24px; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-gradient); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: 700;">T</div>
            <h3 style="color: var(--text-primary); margin-bottom: 4px;">Theara</h3>
            <p style="color: var(--text-muted); font-size: 13px;">Lead Developer</p>
          </div>
          <div style="background: var(--bg-tertiary); border-radius: 16px; padding: 24px; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-gradient); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: 700;">Y</div>
            <h3 style="color: var(--text-primary); margin-bottom: 4px;">Youpheng</h3>
            <p style="color: var(--text-muted); font-size: 13px;">Dashboard Developer</p>
          </div>
          <div style="background: var(--bg-tertiary); border-radius: 16px; padding: 24px; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-gradient); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: 700;">K</div>
            <h3 style="color: var(--text-primary); margin-bottom: 4px;">Khann</h3>
            <p style="color: var(--text-muted); font-size: 13px;">Documentation & Content</p>
          </div>
          <div style="background: var(--bg-tertiary); border-radius: 16px; padding: 24px; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-gradient); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: 700;">S</div>
            <h3 style="color: var(--text-primary); margin-bottom: 4px;">Sivchheng</h3>
            <p style="color: var(--text-muted); font-size: 13px;">UI & Marketing</p>
          </div>
          <div style="background: var(--bg-tertiary); border-radius: 16px; padding: 24px; text-align: center;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-gradient); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: 700;">C</div>
            <h3 style="color: var(--text-primary); margin-bottom: 4px;">Chea</h3>
            <p style="color: var(--text-muted); font-size: 13px;">SEO & Infrastructure</p>
          </div>
        </div>
      </div>
    </main>
    <!-- Footer rendered by app.js -->
    <script src="js/products-data.js"></script>
    <script src="js/app.js"></script>
    <script src="js/about.js"></script>
  </body>
  ```

### js/about.js:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderFooter();
  observeReveal(document.querySelectorAll('.scroll-reveal'));
});
```

**Commands:**
```bash
git checkout -b khann-about
# create about.html and js/about.js
git add about.html js/about.js
git commit -m "Add About Us page with team section"
git push origin khann-about
# Create Pull Request on GitHub
```

---

## Cheang Youpheng — FAQ Page

**Create:** `faq.html` + `js/faq.js`

### faq.html:
- Same `<head>` as contact.html, title: "FAQ — ShopFlow"
- Page title bar: "Frequently Asked Questions"
- Add the FAQ accordion items (10+ questions)

Use existing CSS classes. Add inline style for accordion or put styles in js/faq.js.

### js/faq.js:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderFooter();
  observeReveal(document.querySelectorAll('.scroll-reveal'));

  // Accordion toggle
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
      const item = this.parentElement;
      const answer = this.nextElementSibling;
      item.classList.toggle('active');
      if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
});
```

### faq.html body content (inside <main class="main-content">):
```html
<div class="page-title-bar">
  <h1>Frequently Asked Questions</h1>
  <div class="breadcrumb">
    <a href="index.html">Home</a> <span>/</span> <span>FAQ</span>
  </div>
</div>

<div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
  <!-- Question 1 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>How do I place an order?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>Browse our catalog, click "Add to Cart" on any product, then go to your cart and click "Proceed to Checkout." Fill in your shipping details, upload your payment screenshot, and confirm your order.</p>
    </div>
  </div>

  <!-- Question 2 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>What payment methods do you accept?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>We accept KHQR payment via our linked bank accounts. Simply scan the QR code or use the provided bank account numbers during checkout, then upload your payment confirmation screenshot.</p>
    </div>
  </div>

  <!-- Question 3 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>How do I upload my payment screenshot?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>During checkout, after reviewing your order summary, you'll see a "Payment Screenshot" upload field. Click to select your screenshot image (JPG or PNG), then submit your order.</p>
    </div>
  </div>

  <!-- Question 4 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>How long does order processing take?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>Orders are typically processed within 24 hours after payment confirmation. You can check your order status in your account under "My Orders."</p>
    </div>
  </div>

  <!-- Question 5 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>Can I cancel my order?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>Yes, you can cancel your order as long as it hasn't been processed yet. Contact our support team via Telegram with your order ID to request cancellation.</p>
    </div>
  </div>

  <!-- Question 6 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>How do I track my order?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>Log in to your account and visit the "My Orders" page. You'll see the current status of all your orders (Processing, Completed, or Shipped).</p>
    </div>
  </div>

  <!-- Question 7 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>What is your return policy?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>We accept returns within 7 days of delivery for defective or incorrect items. Please contact our support team to initiate a return.</p>
    </div>
  </div>

  <!-- Question 8 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>How do I create an account?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>Click the "Sign Up" link in the header, fill in your name, email, and password, and submit. You'll be logged in automatically and can start shopping immediately.</p>
    </div>
  </div>

  <!-- Question 9 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>Do you offer international shipping?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>Currently, we ship within Cambodia. For international orders, please contact us directly to discuss arrangements.</p>
    </div>
  </div>

  <!-- Question 10 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>How do I contact support?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>You can reach us via Telegram at @Domzin168, or visit our Contact Us page for more information. We typically respond within a few hours.</p>
    </div>
  </div>

  <!-- Question 11 -->
  <div class="faq-item">
    <div class="faq-question">
      <span>Are the products genuine?</span>
      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="faq-answer">
      <p>Yes! We source our products directly from authorized distributors and trusted suppliers to ensure every item is 100% genuine.</p>
    </div>
  </div>
</div>

<style>
.faq-item {
  background: var(--bg-tertiary);
  border-radius: 12px;
  margin-bottom: 10px;
  overflow: hidden;
}
.faq-question {
  padding: 18px 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--text-primary);
  transition: 0.2s;
}
.faq-question:hover {
  background: rgba(255,255,255,0.05);
}
.faq-question i {
  transition: transform 0.3s;
  color: var(--accent-primary);
}
.faq-item.active .faq-question i {
  transform: rotate(180deg);
}
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: 0 24px;
  background: rgba(0,0,0,0.15);
}
.faq-item.active .faq-answer {
  padding: 18px 24px;
  max-height: 200px;
}
.faq-answer p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}
</style>
```

**Commands:**
```bash
git checkout -b youpheng-faq
# create faq.html and js/faq.js
git add faq.html js/faq.js
git commit -m "Add FAQ page with accordion"
git push origin youpheng-faq
# Create Pull Request on GitHub
```

---

## Theng Sivchheng — Shipping & Returns Page

**Create:** `shipping.html` + `js/shipping.js`

### shipping.html:
- Same `<head>` as contact.html, title: "Shipping & Returns — ShopFlow"
- Breadcrumb: Home / Shipping & Returns
- Content sections:

1. **Shipping Information**
   - Processing time: 24 hours after payment confirmation
   - Delivery timeline: 1-3 business days within Cambodia (Phnom Penh), 3-7 business days for provinces
   - Shipping fee structure
   - Order tracking instructions

2. **Return & Exchange Policy**
   - 7-day return window for defective items
   - Item must be in original packaging
   - How to initiate a return (contact Telegram)
   - Refund processing time

3. **Shipping Restrictions**
   - Currently Cambodia only
   - PO Box limitations
   - Large item delivery terms

4. **Contact for Shipping Issues**
   - Telegram support link
   - Response time

### js/shipping.js:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderFooter();
  observeReveal(document.querySelectorAll('.scroll-reveal'));
});
```

**Commands:**
```bash
git checkout -b theng-shipping
# create shipping.html and js/shipping.js
git add shipping.html js/shipping.js
git commit -m "Add Shipping & Returns page"
git push origin theng-shipping
# Create Pull Request on GitHub
```

---

## Chea Sela — Sitemap & Site Guide Page

**Create:** `site-guide.html` + `js/site-guide.js`

### site-guide.html:
- Same `<head>` as contact.html, title: "Site Guide — ShopFlow"
- Breadcrumb: Home / Site Guide
- A visual index of every page on the site with descriptions

Content structure:
```html
<div class="page-title-bar">
  <h1>Site Guide</h1>
  <div class="breadcrumb">
    <a href="index.html">Home</a> <span>/</span> <span>Site Guide</span>
  </div>
</div>

<div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
  <p style="color: var(--text-secondary); margin-bottom: 32px; line-height: 1.7;">
    Welcome to ShopFlow! Here's a complete guide to everything you can do on our site.
  </p>

  <!-- Customer Pages -->
  <h2 style="color: var(--text-primary); margin-bottom: 20px; font-size: 22px;">🛍️ Shopping</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 40px;">
    <a href="index.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">🏠 Home</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Browse featured products, new arrivals, and special deals</p>
    </a>
    <a href="products.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">📱 All Products</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Full catalog with filters: category, brand, price, color, and more</p>
    </a>
    <a href="cart.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">🛒 Shopping Cart</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Review items, adjust quantities, and proceed to checkout</p>
    </a>
    <a href="checkout.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">💳 Checkout</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Complete your purchase with payment screenshot upload</p>
    </a>
    <a href="wishlist.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">❤️ Wishlist</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Save items and get notified about price drops</p>
    </a>
  </div>

  <!-- Account Pages -->
  <h2 style="color: var(--text-primary); margin-bottom: 20px; font-size: 22px;">👤 Account</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 40px;">
    <a href="signup.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">📝 Sign Up</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Create a new ShopFlow account</p>
    </a>
    <a href="login.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">🔑 Sign In</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Log in to your existing account</p>
    </a>
    <a href="profile.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">👤 My Profile</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Edit your name, avatar, phone, and delivery address</p>
    </a>
    <a href="orders.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">📦 My Orders</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Track your order history and status</p>
    </a>
  </div>

  <!-- Info Pages -->
  <h2 style="color: var(--text-primary); margin-bottom: 20px; font-size: 22px;">ℹ️ Information</h2>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; margin-bottom: 40px;">
    <a href="about.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">📖 About Us</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Learn about ShopFlow and our team</p>
    </a>
    <a href="faq.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">❓ FAQ</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Frequently asked questions about shopping on ShopFlow</p>
    </a>
    <a href="shipping.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">🚚 Shipping & Returns</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Shipping policies, delivery times, and return information</p>
    </a>
    <a href="contact.html" style="background: var(--bg-tertiary); border-radius: 12px; padding: 20px; text-decoration: none; transition: 0.2s; display: block;">
      <h3 style="color: var(--text-primary); margin-bottom: 6px; font-size: 16px;">📞 Contact Us</h3>
      <p style="color: var(--text-muted); font-size: 13px; margin: 0;">Get in touch with our support team</p>
    </a>
  </div>
</div>
```

### js/site-guide.js:
```javascript
document.addEventListener('DOMContentLoaded', function() {
  renderHeader();
  renderFooter();
  observeReveal(document.querySelectorAll('.scroll-reveal'));
});
```

**Commands:**
```bash
git checkout -b sela-siteguide
# create site-guide.html and js/site-guide.js
git add site-guide.html js/site-guide.js
git commit -m "Add Site Guide page with navigation index"
git push origin sela-siteguide
# Create Pull Request on GitHub
```

---

## WORKFLOW

1. Each person creates their own branch from main:
   ```bash
   git checkout -b their-name-taskname
   ```

2. Create ONLY their new files (NO existing files modified)

3. Commit and push:
   ```bash
   git add their-new-files
   git commit -m "Add [page name] page"
   git push origin their-name-taskname
   ```

4. Go to GitHub → Create Pull Request (their branch → main)

5. Theara reviews and merges each PR

6. Theara does ONE final commit to add footer links to the new pages

## TEMPLATE for any new HTML page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title — ShopFlow</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%238b5cf6'/><text x='16' y='23' font-size='20' text-anchor='middle' fill='white' font-family='Arial' font-weight='bold'>S</text></svg>">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <!-- Header rendered by app.js -->

  <main class="main-content">
    <div class="page-title-bar">
      <h1>Page Title</h1>
      <div class="breadcrumb">
        <a href="index.html">Home</a> <span>/</span> <span style="color: white;">Page Title</span>
      </div>
    </div>

    <!-- YOUR CONTENT HERE -->

  </main>

  <!-- Footer rendered by app.js -->

  <script src="js/products-data.js"></script>
  <script src="js/app.js"></script>
  <script src="js/your-script.js"></script>
</body>
</html>
```

## CRITICAL RULES
- ✅ Create ONLY new files (HTML in root, JS in js/ folder)
- ✅ Copy the `<head>` from contact.html exactly
- ✅ Load `js/products-data.js` and `js/app.js` at the bottom
- ❌ NEVER edit existing files (server.js, database.js, any existing .html, .js, .css)
- ❌ NEVER touch .env
- ❌ If unsure → ask Theara
