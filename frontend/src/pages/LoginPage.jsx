import React, { useState } from 'react';
import { API_URL } from '../config/api';
import logo from '../../assets/logo.jpg';

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
        body: JSON.stringify({ customerNumber }),
      });
      const data = await response.json();
      if (response.ok && data.customer) {
        onLogin({
          id: data.customer.id,
          name: data.customer.name,
          customerNumber: data.customer.customerNumber,
        }, 'customer');
      } else {
        setError('מספר לקוח לא נמצא');
      }
    } catch {
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
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-5 py-8 sm:py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #fdf9f4 0%, #ede4d4 100%)' }}
    >
      {/* Decorative glow */}
      <div className="absolute w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(184,124,74,0.07) 0%, transparent 70%)', top: -150, right: -100 }} />

      {/* Logo */}
      <div className="relative mb-6 sm:mb-8" style={{ width: 120, height: 120 }}>
        <div className="absolute inset-0 rounded-full"
          style={{ inset: -10, background: 'radial-gradient(circle, rgba(184,124,74,0.1) 0%, transparent 70%)' }} />
        <img
          src={logo}
          alt="ח.ס אלפי"
          className="relative rounded-full object-cover w-full h-full"
          style={{
            boxShadow: '0 8px 32px rgba(184,124,74,0.22), 0 2px 8px rgba(44,28,8,0.08)',
            border: '4px solid rgba(255,255,255,0.9)',
          }}
        />
      </div>

      {/* Brand name */}
      <div className="text-center mb-6 sm:mb-9">
        <h1 className="text-2xl sm:text-4xl font-black text-brand-900 tracking-tight mb-1">ח.ס אלפי</h1>
        <p className="text-xs sm:text-sm text-brand-400 font-medium">הספקת מזון למשרדים</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl px-6 sm:px-10 py-6 sm:py-9 relative z-10"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(236,230,220,0.8)',
          boxShadow: '0 4px 16px rgba(44,28,8,0.08)',
        }}
      >
        {/* Error */}
        {error && (
          <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-lg text-xs sm:text-sm font-semibold border-r-4 border-red-500 bg-red-50 text-red-700">
            {error}
          </div>
        )}

        {/* Pill Tabs */}
        <div className="flex bg-brand-100 rounded-lg p-1 gap-1 mb-6 sm:mb-7">
          {['customer', 'admin'].map((t) => (
            <button
              key={t}
              onClick={() => { setActiveTab(t); setError(''); }}
              className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-md transition-all duration-200 ${
                activeTab === t
                  ? 'bg-white text-brand-800 shadow-sm'
                  : 'text-brand-400 hover:text-brand-600'
              }`}
            >
              {t === 'customer' ? 'כניסה ללקוח' : 'כניסה למנהל'}
            </button>
          ))}
        </div>

        {/* Customer form */}
        {activeTab === 'customer' && (
          <form onSubmit={handleCustomerLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold text-brand-700 mb-2 tracking-wide">מספר לקוח</label>
              <input
                type="text"
                placeholder="הזן את מספר הלקוח"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-[1.5px] border-brand-200 rounded-lg bg-brand-50
                  focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-[3px] focus:ring-brand-100
                  placeholder:text-brand-300 transition-all duration-200 disabled:opacity-50 text-right"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !customerNumber}
              className="w-full py-2.5 sm:py-3 rounded-lg text-sm font-extrabold text-white transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #b87c4a, #8a5c32)',
                boxShadow: '0 4px 14px rgba(184,124,74,0.28)',
              }}
            >
              {loading ? 'מתחבר...' : 'כנס לחשבון →'}
            </button>
          </form>
        )}

        {/* Admin form */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-bold text-brand-700 mb-2 tracking-wide">שם משתמש</label>
              <input
                type="text"
                placeholder="admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-[1.5px] border-brand-200 rounded-lg bg-brand-50
                  focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-[3px] focus:ring-brand-100
                  placeholder:text-brand-300 transition-all duration-200 text-right"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-700 mb-2 tracking-wide">סיסמא</label>
              <input
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-[1.5px] border-brand-200 rounded-lg bg-brand-50
                  focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-[3px] focus:ring-brand-100
                  placeholder:text-brand-300 transition-all duration-200 text-right"
              />
            </div>
            <button
              type="submit"
              disabled={!adminUsername || !adminPassword}
              className="w-full py-2.5 sm:py-3 rounded-lg text-sm font-extrabold text-white transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #b87c4a, #8a5c32)',
                boxShadow: '0 4px 14px rgba(184,124,74,0.28)',
              }}
            >
              כנס כמנהל →
            </button>
            <p className="text-xs text-brand-300 text-center">admin / admin123</p>
          </form>
        )}
      </div>

      <p className="text-xs text-brand-300 mt-6 sm:mt-8 relative z-10 text-center">מערכת הזמנות מודרנית ויעילה</p>
    </div>
  );
}
