import React, { useState } from 'react';
import AdminNav from '../components/admin/AdminNav';
import CustomerManagement from '../components/admin/CustomerManagement';
import CategoryManagement from '../components/admin/CategoryManagement';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import Dashboard from '../components/admin/Dashboard';

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="py-6">
      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
}
