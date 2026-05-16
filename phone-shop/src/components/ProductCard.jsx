import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.name}</h3>
          
          {/* Price */}
          <div className="mb-2">
            {product.originalPrice > product.price && (
              <span className="text-red-500 font-bold mr-2">${product.price.toFixed(2)}</span>
            )}
            <span className={`font-bold ${product.originalPrice > product.price ? 'line-through text-gray-400' : ''}`}>
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>

          {/* Monthly Payment */}
          <p className="text-sm text-gray-600 mb-3">
            Or ${product.monthlyPayment.toFixed(2)}/mo. for 12 mo.*
          </p>

          {/* Deal Timer */}
          {product.dealEnds && (
            <p className="text-sm text-orange-500 mb-3">
              🕒 Deal ends in {product.dealEnds}d
            </p>
          )}

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
