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
    return <div className="text-center py-8">טוען לקוחות...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">ניהול לקוחות</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {showForm ? '✕ ביטול' : '+ הוסף לקוח'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="customerNumber"
              placeholder="מספר חשבון *"
              value={formData.customerNumber}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="customerName"
              placeholder="שם חשבון *"
              value={formData.customerName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="כתובת"
              value={formData.address}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              name="city"
              placeholder="עיר"
              value={formData.city}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="מיקוד"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="tel"
              name="phone1"
              placeholder="טלפון 1"
              value={formData.phone1}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="tel"
              name="phone2"
              placeholder="טלפון 2"
              value={formData.phone2}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="tel"
              name="phone3"
              placeholder="טלפון 3"
              value={formData.phone3}
              onChange={handleInputChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
          >
            שמור לקוח
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-right font-semibold">מספר חשבון</th>
              <th className="px-6 py-3 text-right font-semibold">שם</th>
              <th className="px-6 py-3 text-right font-semibold">עיר</th>
              <th className="px-6 py-3 text-right font-semibold">טלפון</th>
              <th className="px-6 py-3 text-right font-semibold">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-right">{customer.customerNumber}</td>
                <td className="px-6 py-4 text-right">{customer.name}</td>
                <td className="px-6 py-4 text-right">{customer.city || '-'}</td>
                <td className="px-6 py-4 text-right">{customer.phone1 || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
