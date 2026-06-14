import React from 'react';

export default function AdminNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', label: '📊 דוח ניהול' },
    { id: 'customers', label: '👥 לקוחות' },
    { id: 'categories', label: '📁 קטגוריות' },
    { id: 'products', label: '📦 מוצרים' },
    { id: 'orders', label: '📋 הזמנות' }
  ];

  return (
    <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-3 font-semibold transition whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
