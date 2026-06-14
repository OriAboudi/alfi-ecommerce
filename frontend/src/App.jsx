import React, { useState, useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'customer' or 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    const storedUserType = localStorage.getItem('userType');
    
    if (storedUser && storedUserType) {
      setCurrentUser(JSON.parse(storedUser));
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  const handleLogin = (user, type) => {
    setCurrentUser(user);
    setUserType(type);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userType', type);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold">טוען...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-blue-600 text-white shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ח.ס אלפי</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {userType === 'admin' ? '👨‍💼 ניהול' : '👤 ' + currentUser.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              התנתקות
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {userType === 'admin' ? (
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        ) : (
          <CustomerDashboard user={currentUser} onLogout={handleLogout} />
        )}
      </main>
    </div>
  );
}

export default App;
