import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('קטגוריה נוספה בהצלחה!');
        setFormData({ name: '', description: '' });
        setShowForm(false);
        fetchCategories();
      } else {
        const error = await response.json();
        alert('שגיאה: ' + error.error);
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('הוא בטוח שברצונך למחוק את הקטגוריה?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('קטגוריה נמחקה בהצלחה!');
        fetchCategories();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">טוען קטגוריות...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול קטגוריות</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {showForm ? '✕ ביטול' : '+ הוסף קטגוריה'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <input
            type="text"
            placeholder="שם קטגוריה *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            required
          />
          <textarea
            placeholder="תיאור (אופציונלי)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            rows="3"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
          >
            שמור קטגוריה
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-bold text-right mb-2">{category.name}</h3>
            <p className="text-sm text-gray-600 text-right mb-3">
              {category.productCount} מוצרים
            </p>
            {category.description && (
              <p className="text-sm text-gray-500 text-right mb-4">
                {category.description}
              </p>
            )}
            <button
              onClick={() => handleDelete(category.id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              מחק
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
