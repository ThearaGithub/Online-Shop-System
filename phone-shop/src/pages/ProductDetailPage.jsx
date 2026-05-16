import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));
  
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedStorage, setSelectedStorage] = useState(product?.storages?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor,
      storage: selectedStorage,
      quantity
    });
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-blue-600 font-semibold">{product.brand}</p>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-500">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl line-through text-gray-400">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-gray-600 mt-2">Or ${product.monthlyPayment.toFixed(2)}/mo. for 12 mo.</p>
          </div>

          {/* Promotion */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">🎁 Free: Clear Case + Screen + *Falcon Trust+ (With add-on products)</p>
          </div>

          {/* Storage Selection */}
          {product.storages && product.storages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Choose your storage</h3>
              <div className="flex gap-3">
                {product.storages.map(storage => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-6 py-3 rounded-lg border-2 transition ${
                      selectedStorage === storage 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Choose your color</h3>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-lg border-2 transition ${
                      selectedColor === color 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Warranty */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✓ {product.warranty}</h3>
            <p className="text-green-700 text-sm">
              - 1 Year screen crack warranty
            </p>
            <p className="text-green-700 text-sm">
              - 2 Year warranty from Apple
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex gap-4">
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-3 font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">SPECIFICATION</h2>
        
        <div className="space-y-4">
          {product.specs && Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="flex border-b pb-3 last:border-0">
              <span className="font-semibold w-48 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <span className="text-gray-600">: {value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
