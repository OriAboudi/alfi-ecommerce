import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

const CATEGORY_COLORS = {
  0: { bg: 'from-pink-500 to-rose-500', icon: '🍓' },
  1: { bg: 'from-orange-500 to-amber-500', icon: '☕' },
  2: { bg: 'from-green-500 to-emerald-500', icon: '🥗' },
  3: { bg: 'from-purple-500 to-violet-500', icon: '🍰' },
  4: { bg: 'from-blue-500 to-cyan-500', icon: '🥤' },
  5: { bg: 'from-yellow-500 to-orange-500', icon: '🌽' },
  6: { bg: 'from-indigo-500 to-blue-500', icon: '🧊' },
  7: { bg: 'from-red-500 to-pink-500', icon: '🍲' },
};

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
    return <div className="text-center py-12 text-gray-600">טוען קטגוריות...</div>;
  }

  const getColorByIndex = (index) => {
    return CATEGORY_COLORS[index % Object.keys(CATEGORY_COLORS).length];
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-right">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ניהול קטגוריות</h2>
          <p className="text-gray-600 mt-1">סה"כ: {categories.length} קטגוריות</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 ${
            showForm
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {showForm ? '✕ ביטול' : '+ הוסף קטגוריה'}
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-right">הוסף קטגוריה חדשה</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                שם הקטגוריה *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                תיאור (אופציונלי)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
            >
              ✓ שמור קטגוריה
            </button>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {categories.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            אין קטגוריות להצגה
          </div>
        ) : (
          categories.map((category, index) => {
            const colors = getColorByIndex(index);
            return (
              <div
                key={category.id}
                className="group rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
              >
                {/* Card Header with Gradient */}
                <div className={`bg-gradient-to-r ${colors.bg} text-white p-6 text-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" />
                  <p className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {colors.icon}
                  </p>
                  <h3 className="text-xl font-bold relative z-10">{category.name}</h3>
                </div>

                {/* Card Body */}
                <div className="bg-white p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {category.productCount || 0}
                    </span>
                    <span className="text-sm text-gray-600">מוצרים</span>
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 text-right">
                      {category.description}
                    </p>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                    >
                      🗑️ מחק
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
