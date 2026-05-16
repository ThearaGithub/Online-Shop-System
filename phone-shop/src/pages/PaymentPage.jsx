import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!uploadedFile) {
      alert('Please upload your payment receipt');
      return;
    }
    clearCart();
    navigate('/order-success');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>
      
      <div className="max-w-2xl mx-auto">
        {/* KHQR Payment Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold mb-6 text-center">KHQR Payment</h2>
          
          <div className="bg-gray-100 rounded-lg p-6 text-center mb-6">
            <div className="w-48 h-48 bg-white mx-auto mb-4 flex items-center justify-center">
              {/* QR Code Placeholder */}
              <div className="text-gray-400">
                <svg className="w-40 h-40" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="10" y="10" width="30" height="30" />
                  <rect x="60" y="10" width="30" height="30" />
                  <rect x="10" y="60" width="30" height="30" />
                  <rect x="50" y="50" width="10" height="10" />
                  <rect x="70" y="70" width="10" height="10" />
                  <rect x="50" y="70" width="10" height="10" />
                  <rect x="70" y="50" width="10" height="10" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600">Scan Me</p>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Bank Name:</span>
              <span>ACLEDA</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Number:</span>
              <span>081925679</span>
            </div>
          </div>
        </div>

        {/* Upload Receipt */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 text-center">Please upload your payment receipt here</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              id="file-upload"
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-gray-400 mb-2">📁</div>
              <p className="text-blue-600 font-semibold">Click to upload</p>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG required</p>
              {uploadedFile && (
                <p className="text-green-600 mt-2">✓ {uploadedFile.name}</p>
              )}
            </label>
          </div>
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
