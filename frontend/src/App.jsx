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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="text-xl font-semibold text-green-900">טוען...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div dir="rtl">
      {userType === 'admin' ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <CustomerDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;