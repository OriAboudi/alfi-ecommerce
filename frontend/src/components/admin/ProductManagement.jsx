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
        setFormData({
          itemId: '',
          name: '',
          price: '',
          categoryId: '',
          description: ''
        });
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
    return <div className="text-center py-8">טוען מוצרים...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול מוצרים</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {showForm ? '✕ ביטול' : '+ הוסף מוצר'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="itemId"
              placeholder="מספר סידור *"
              value={formData.itemId}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="שם המוצר *"
              value={formData.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="מחיר *"
              value={formData.price}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
              step="0.01"
              required
            />
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">בחר קטגוריה *</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <textarea
              name="description"
              placeholder="תיאור (אופציונלי)"
              value={formData.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
              rows="2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
          >
            שמור מוצר
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-right font-semibold">מספר סידור</th>
              <th className="px-6 py-3 text-right font-semibold">שם</th>
              <th className="px-6 py-3 text-right font-semibold">מחיר</th>
              <th className="px-6 py-3 text-right font-semibold">קטגוריה</th>
              <th className="px-6 py-3 text-right font-semibold">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-right">{product.itemId}</td>
                <td className="px-6 py-4 text-right">{product.name}</td>
                <td className="px-6 py-4 text-right">₪{parseFloat(product.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-right">{product.categoryName}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
