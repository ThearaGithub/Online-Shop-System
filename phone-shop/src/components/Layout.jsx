import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, user } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) return null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex gap-4">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
          </div>
          <div className="flex gap-4">
            {user ? (
              <Link to="/account" className="text-gray-600 hover:text-gray-900">
                My Account
              </Link>
            ) : (
              <>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">Register</Link>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Phone Shop
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Type something..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Cart and Account */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t">
        <div className="container mx-auto px-4">
          <ul className="flex gap-6 py-3 overflow-x-auto">
            <li><Link to="/category/product" className="whitespace-nowrap hover:text-blue-600">Product</Link></li>
            <li><Link to="/category/accessories" className="whitespace-nowrap hover:text-blue-600">Accessories</Link></li>
            <li><Link to="/category/secondhand" className="whitespace-nowrap hover:text-blue-600">SecondHand</Link></li>
            <li><Link to="/category/special-offer" className="whitespace-nowrap hover:text-blue-600 text-red-500">Special Offer</Link></li>
            <li><Link to="/category/pre-order" className="whitespace-nowrap hover:text-blue-600">Pre Order</Link></li>
            <li><Link to="/news" className="whitespace-nowrap hover:text-blue-600">News</Link></li>
            <li><Link to="/contact" className="whitespace-nowrap hover:text-blue-600">Contact Us</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) return null;

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Phone Shop</h3>
            <p className="text-gray-400 text-sm">
              Your trusted destination for the latest smartphones and accessories.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/category/mobile-phone" className="hover:text-white">Mobile Phones</Link></li>
              <li><Link to="/category/accessories" className="hover:text-white">Accessories</Link></li>
              <li><Link to="/category/smart-watch" className="hover:text-white">Smart Watches</Link></li>
              <li><Link to="/category/special-offer" className="hover:text-white">Special Offers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 Phnom Penh, Cambodia</li>
              <li>📞 +855 12 345 678</li>
              <li>✉️ info@phoneshop.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2026 Phone Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
