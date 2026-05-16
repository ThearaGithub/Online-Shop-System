import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { category } = useParams();
  const [selectedBrand, setSelectedBrand] = useState('All');
  
  let filteredProducts = products;
  let pageTitle = 'All Products';

  if (category === 'special-offer') {
    filteredProducts = products.filter(p => p.dealEnds);
    pageTitle = 'Special Offers';
  } else if (category === 'new') {
    filteredProducts = products.filter(p => p.isNew);
    pageTitle = 'New Arrivals';
  } else if (category === 'watch') {
    filteredProducts = products.filter(p => p.category === 'Watch');
    pageTitle = 'Smart Watches';
  } else if (category === 'accessories') {
    filteredProducts = products.filter(p => p.category === 'Accessories');
    pageTitle = 'Accessories';
  } else if (category === 'product' || category === 'mobile-phone') {
    filteredProducts = products.filter(p => p.category === 'iPhone' || p.category === 'Samsung' || p.category === 'Android');
    pageTitle = 'Mobile Phones';
  }

  if (selectedBrand !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
  }

  const brands = ['All', ...new Set(filteredProducts.map(p => p.brand))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {brands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              selectedBrand === brand 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
