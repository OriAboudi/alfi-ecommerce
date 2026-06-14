import React, { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, onAddToCart }) {
  const [expandedProduct, setExpandedProduct] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-600">טוען מוצרים...</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 text-lg">אין מוצרים זמינים</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
