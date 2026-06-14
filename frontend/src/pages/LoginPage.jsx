import React, { useState } from 'react';
import { API_URL } from '../config/api';

export default function LoginPage({ onLogin }) {
  const [customerNumber, setCustomerNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerNumber })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'שגיאה בהתחברות');
        return;
      }

      onLogin(data.customer, 'customer');
    } catch (err) {
      setError('שגיאה בחיבור לשרת');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // For demo purposes, any "admin" input goes to admin dashboard
    // In production, add proper authentication
    onLogin({ name: 'Admin', id: 'admin' }, 'admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Customer Login */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">ח.ס אלפי</h2>
          <p className="text-center text-gray-600 mb-8">הזמנת מוצרים עבור לקוחות</p>

          <form onSubmit={handleCustomerLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                מספר חשבון (חשבון):
              </label>
              <input
                type="text"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                placeholder="הכנס מספר חשבון"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-400"
            >
              {loading ? 'טוען...' : 'כניסה'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600 text-center mb-2">דוגמאות חשבון:</p>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p>2001 - סג"מ</p>
              <p>2002 - אמית</p>
              <p>2003 - ג. יהל</p>
            </div>
          </div>
        </div>

        {/* Admin Login */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <p className="text-center text-gray-600 mb-4">או כניסה למערכת ניהול</p>

          <form onSubmit={handleAdminLogin}>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              👨‍💼 כניסה כמנהל
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            (לדוגמה בלבד - ללא אימות סיסמה)
          </p>
        </div>
      </div>
    </div>
  );
}
