import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            to="/" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">View Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-red-500 font-bold">${item.price.toFixed(2)}</p>
                
                {item.options && (
                  <div className="text-sm text-gray-600 mt-2">
                    {item.options.color && <p>Color: {item.options.color}</p>}
                    {item.options.storage && <p>Storage: {item.options.storage}</p>}
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1">X {item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">PAYMENT SUMMARY</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>First Purchase Discount</span>
                <span>-$10.00</span>
              </div>
              
              <div className="flex justify-between text-green-600">
                <span>Delivery Fee</span>
                <span>Free</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})</span>
                  <span className="text-red-500">${(cartTotal - 10).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition"
            >
              CHECK OUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
