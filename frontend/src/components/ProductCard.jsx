import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    alert(`${product.name} נוסף לעגלה!`);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 text-right mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 text-right">
          ID: {product.itemId}
        </p>
      </div>

      <div className="bg-blue-50 p-3 rounded mb-4">
        <div className="text-3xl font-bold text-blue-600 text-center">
          ₪{parseFloat(product.price).toFixed(2)}
        </div>
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 text-right mb-4">
          {product.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-4 justify-center">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          -
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 text-center border border-gray-300 rounded py-1"
          min="1"
        />
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddClick}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
      >
        הוסף לעגלה
      </button>
    </div>
  );
}
