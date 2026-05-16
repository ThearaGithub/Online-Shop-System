import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const specialOffers = products.filter(p => p.dealEnds);
  const newArrivals = products.filter(p => p.isNew);
  const watches = products.filter(p => p.category === 'Watch');
  const accessories = products.filter(p => p.category === 'Accessories');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <section className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              iPhone 17 Pro and 17 Pro Max
            </h1>
            <p className="text-lg mb-6 opacity-90">
              The iPhone 17 Pro and Pro Max brings a sleek aluminum unibody design, 
              blazing-fast A19 Pro chip (3nm), and a brilliant OLED ProMotion 120Hz display.
            </p>
            <Link 
              to="/product/2" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              AVAILABLE NOW
            </Link>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" 
              alt="iPhone 17 Pro" 
              className="max-w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">POPULAR BRANDS</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['Apple', 'Samsung', 'OPPO', 'Nothing', 'Xiaomi', 'HUAWEI'].map(brand => (
            <div key={brand} className="bg-white p-4 rounded-xl shadow-sm text-center hover:shadow-md transition">
              <p className="font-semibold">{brand}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-500">🔥 SPECIAL OFFER</h2>
          <Link to="/category/special-offer" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialOffers.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrival */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">NEW ARRIVAL</h2>
          <Link to="/category/new" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 8).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">POPULAR CATEGORIES</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map(cat => (
            <Link 
              key={cat.slug} 
              to={`/category/${cat.slug}`}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center"
            >
              <h3 className="font-semibold mb-2">{cat.name}</h3>
              <span className="text-blue-600 text-sm">view more &gt;&gt;</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Smart Watch */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">SMART WATCH</h2>
          <Link to="/category/watch" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {watches.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Accessories */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">ACCESSORIES</h2>
          <Link to="/category/accessories" className="text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessories.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
