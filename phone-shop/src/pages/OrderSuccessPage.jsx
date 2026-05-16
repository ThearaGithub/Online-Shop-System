import { Link } from 'react-router-dom';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-4">Thank you for your Order.</h1>
          <p className="text-gray-600 mb-8">
            Our staff will contact you soon to confirm your order
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/" 
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              CONTINUES SHOPPING
            </Link>
            <Link 
              to="/account/orders" 
              className="block w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              VIEW MY ORDER
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
