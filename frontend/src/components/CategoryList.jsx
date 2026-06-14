import React from 'react';

export default function CategoryList({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">קטגוריות</h3>
      
      <button
        onClick={() => onSelectCategory(null)}
        className={`w-full text-right px-4 py-2 rounded mb-2 transition ${
          selectedCategory === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        הכל
      </button>

      <div className="space-y-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-right px-4 py-2 rounded transition ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <div className="text-sm font-semibold">{category.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
