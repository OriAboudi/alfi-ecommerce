import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerNumber: '',
    customerName: '',
    address: '',
    city: '',
    zipCode: '',
    phone1: '',
    phone2: '',
    phone3: ''
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
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
      const response = await fetch(`${API_URL}/admin/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('לקוח נוסף בהצלחה!');
        setFormData({
          customerNumber: '',
          customerName: '',
          address: '',
          city: '',
          zipCode: '',
          phone1: '',
          phone2: '',
          phone3: ''
        });
        setShowForm(false);
        fetchCustomers();
      } else {
        const error = await response.json();
        alert('שגיאה: ' + error.error);
      }
    } catch (err) {
      console.error('Error adding customer:', err);
      alert('שגיאה בהוספת לקוח');
    }
  };

  const handleDelete = async (customerId) => {
    if (!confirm('הוא בטוח שברצונך למחוק את הלקוח?')) return;
    try {
      const response = await fetch(`${API_URL}/admin/customers/${customerId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('לקוח נמחק בהצלחה!');
        fetchCustomers();
      } else {
        alert('שגיאה במחיקת לקוח');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">טוען לקוחות...</div>;
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customerNumber.includes(searchTerm)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-right">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ניהול לקוחות</h2>
          <p className="text-gray-600 mt-1">סה"כ: {customers.length} לקוחות</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-white transition-all duration-200 ${
            showForm
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {showForm ? '✕ ביטול' : '+ הוסף לקוח'}
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="חפש לקוח לפי שם או מספר חשבון..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-right text-base"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Add Customer Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 md:p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-right">הוסף לקוח חדש</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  מספר חשבון *
                </label>
                <input
                  type="text"
                  name="customerNumber"
                  value={formData.customerNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  שם חשבון *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  כתובת
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  עיר
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  מיקוד
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  טלפון 1
                </label>
                <input
                  type="tel"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  טלפון 2
                </label>
                <input
                  type="tel"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  טלפון 3
                </label>
                <input
                  type="tel"
                  name="phone3"
                  value={formData.phone3}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-right"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-200"
            >
              ✓ שמור לקוח
            </button>
          </form>
        </div>
      )}

      {/* Customers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchTerm ? 'לא נמצאו לקוחות תואמים' : 'אין לקוחות להצגה'}
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-r-4 border-r-purple-500 hover:border-r-purple-600"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
                <p className="text-sm font-semibold opacity-90">לקוח #{customer.customerNumber}</p>
                <h3 className="text-lg font-bold mt-1 line-clamp-2">{customer.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 text-right">
                {customer.city && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">📍</span>
                    <span className="font-semibold text-gray-900">{customer.city}</span>
                  </div>
                )}

                {customer.address && (
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm text-gray-600">🏠</span>
                    <span className="text-sm text-gray-700 line-clamp-2">{customer.address}</span>
                  </div>
                )}

                <div className="space-y-1 pt-2 border-t border-gray-200">
                  {customer.phone1 && (
                    <p className="text-sm">
                      <span className="text-gray-600">📱</span>
                      <span className="ml-2 text-gray-900">{customer.phone1}</span>
                    </p>
                  )}
                  {customer.phone2 && (
                    <p className="text-sm">
                      <span className="text-gray-600">📱</span>
                      <span className="ml-2 text-gray-900">{customer.phone2}</span>
                    </p>
                  )}
                  {customer.phone3 && (
                    <p className="text-sm">
                      <span className="text-gray-600">📱</span>
                      <span className="ml-2 text-gray-900">{customer.phone3}</span>
                    </p>
                  )}
                </div>

                {customer.zipCode && (
                  <p className="text-xs text-gray-600 pt-2">מיקוד: {customer.zipCode}</p>
                )}
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
                >
                  🗑️ מחק לקוח
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
