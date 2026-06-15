import React, { useState } from 'react';
import { API_URL } from '../config/api';
import logo from '../../assets/logo.jpg'; // Import the logo

export default function LoginPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState('customer');
  const [customerNumber, setCustomerNumber] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_PASSWORD = 'admin123';

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

      if (response.ok && data.customer) {
        onLogin({
          id: data.customer.id,
          name: data.customer.customer_name,
          customerNumber: data.customer.customer_number
        }, 'customer');
      } else {
        setError('מספר לקוח לא נמצא');
      }
    } catch (err) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError('');

    if (adminUsername === 'admin' && adminPassword === ADMIN_PASSWORD) {
      onLogin({ name: 'Admin' }, 'admin');
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  return (
    <div 
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-[#f5f1e8] to-[#e8dcc8] flex flex-col items-center justify-center px-5 py-10"
    >
      {/* Header Section */}
      <div className="text-center mb-12">
        {/* Logo Image */}
        <div className="mb-6 flex justify-center">
          <img 
            src={logo}
            alt="ח.ס אלפי"
            className="w-80 h-80 rounded-full shadow-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#2c2416] mb-2">
ח.ס אלפי
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-[#6b5d52]">
          צור הזמנה בקלות
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-10">
        
        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-300 rounded-md text-right">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Tab System */}
        <div className="flex gap-0 border-b-2 border-gray-200 mb-8">
          <button 
            onClick={() => {
              setActiveTab('customer');
              setError('');
            }}
            className={`flex-1 py-3 text-sm font-semibold border-b-4 transition-all ${
              activeTab === 'customer' 
                ? 'text-[#2c2416] border-[#8b7355]' 
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            כניסה ללקוח
          </button>
          <button 
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`flex-1 py-3 text-sm font-semibold border-b-4 transition-all ${
              activeTab === 'admin' 
                ? 'text-[#2c2416] border-[#8b7355]' 
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            כניסה למנהל
          </button>
        </div>

        {/* Customer Login Form */}
        {activeTab === 'customer' && (
          <form onSubmit={handleCustomerLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#2c2416] mb-2">
                מספר לקוח
              </label>
              <input 
                type="text" 
                placeholder="הזן את מספר הלקוח"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md
                  focus:outline-none focus:border-[#8b7355] 
                  focus:ring-4 focus:ring-[rgba(139,115,85,0.1)]
                  transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !customerNumber}
              className="w-full py-3 bg-[#8b7355] text-white font-semibold 
                rounded-md hover:bg-[#6b5345] transition-all duration-300 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'טוען...' : 'כנס לחשבון'}
            </button>
          </form>
        )}

        {/* Admin Login Form */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#2c2416] mb-2">
                שם משתמש
              </label>
              <input 
                type="text" 
                placeholder="הזן את שם המשתמש"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md
                  focus:outline-none focus:border-[#8b7355] 
                  focus:ring-4 focus:ring-[rgba(139,115,85,0.1)]
                  transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2c2416] mb-2">
                סיסמא
              </label>
              <input 
                type="password" 
                placeholder="הזן את הסיסמא"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-3 text-sm border border-gray-300 rounded-md
                  focus:outline-none focus:border-[#8b7355] 
                  focus:ring-4 focus:ring-[rgba(139,115,85,0.1)]
                  transition-all duration-300"
              />
            </div>

            <button 
              type="submit"
              disabled={!adminUsername || !adminPassword}
              className="w-full py-3 bg-[#8b7355] text-white font-semibold 
                rounded-md hover:bg-[#6b5345] transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              כנס כמנהל
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              שם משתמש: admin | סיסמא: admin123
            </p>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-8 text-center">
        פתרון ניהול הזמנות מודרני ויעיל
      </p>
    </div>
  );
}