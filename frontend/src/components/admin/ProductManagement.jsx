import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemId: '',
    name: '',
    price: '',
    categoryId: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('מוצר נוסף בהצלחה!');
        setFormData({ itemId: '', name: '', price: '', categoryId: '', description: '' });
        setShowForm(false);
        fetchProducts();
      } else {
        const error = await response.json();
        alert('שגיאה: ' + error.error);
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('הוא בטוח שברצונך למחוק את המוצר?')) return;
    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('מוצר נמחק בהצלחה!');
        fetchProducts();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">טוען מוצרים...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-right">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ניהול מוצרים</h2>
          <p className="text-gray-600 mt-1">סה"כ: {products.length} מוצרים</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 ${
            showForm
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {showForm ? '✕ ביטול' : '+ הוסף מוצר'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-right">הוסף מוצר חדש</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  מספר סידור *
                </label>
                <input
                  type="text"
                  name="itemId"
                  value={formData.itemId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  שם המוצר *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  מחיר (₪) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  קטגוריה *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                  required
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  תיאור (אופציונלי)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                  rows="3"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
            >
              ✓ שמור מוצר
            </button>
          </form>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            אין מוצרים להצגה
          </div>
        ) : (
          products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-t-4 border-t-blue-500 hover:border-t-blue-600"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                <p className="text-sm font-semibold opacity-90">מספר: {product.itemId}</p>
                <h3 className="text-xl font-bold mt-1 line-clamp-2">{product.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">מחיר:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₪{parseFloat(product.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">קטגוריה:</span>
                  <span className="text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                    {product.categoryName}
                  </span>
                </div>
                {product.description && (
                  <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                    <p className="line-clamp-2">{product.description}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                >
                  🗑️ מחק מוצר
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
