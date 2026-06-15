import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    categories: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});

  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ itemId: '', name: '', price: '', categoryId: '' });
  const [newCustomer, setNewCustomer] = useState({ customerNumber: '', name: '', address: '', city: '', phone: '' });
  const [expandedOrder, setExpandedOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, customersRes, productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/admin/dashboard/stats`),
        fetch(`${API_URL}/customers`),
        fetch(`${API_URL}/admin/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/orders`)
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (customersRes.ok) setCustomers((await customersRes.json()).customers || []);
      if (productsRes.ok) setProducts((await productsRes.json()).products || []);
      if (categoriesRes.ok) setCategories((await categoriesRes.json()).categories || []);
      if (ordersRes.ok) setOrders((await ordersRes.json()).orders || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Product Management
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.itemId || !newProduct.name || !newProduct.price || !newProduct.categoryId) {
      alert('אנא מלא את כל השדות');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: newProduct.itemId,
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          categoryId: parseInt(newProduct.categoryId)
        })
      });

      if (response.ok) {
        alert('מוצר נוסף בהצלחה!');
        setNewProduct({ itemId: '', name: '', price: '', categoryId: '' });
        fetchAllData();
      }
    } catch (err) {
      alert('שגיאה בהוספת מוצר');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct.name || !editingProduct.price) {
      alert('אנא מלא את כל השדות');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: editingProduct.itemId,
          name: editingProduct.name,
          price: parseFloat(editingProduct.price),
          categoryId: editingProduct.categoryId
        })
      });

      if (response.ok) {
        alert('מוצר עודכן בהצלחה!');
        setEditingProduct(null);
        fetchAllData();
      }
    } catch (err) {
      alert('שגיאה בעדכון מוצר');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('האם אתה בטוח?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('מוצר נמחק בהצלחה!');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.customerNumber || !newCustomer.name) {
      alert('אנא מלא את השדות החובה');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerNumber: newCustomer.customerNumber,
          customerName: newCustomer.name,
          address: newCustomer.address,
          city: newCustomer.city,
          phone1: newCustomer.phone
        })
      });

      if (response.ok) {
        alert('לקוח נוסף בהצלחה!');
        setNewCustomer({ customerNumber: '', name: '', address: '', city: '', phone: '' });
        fetchAllData();
      }
    } catch (err) {
      alert('שגיאה בהוספת לקוח');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('האם אתה בטוח?')) return;

    try {
      const response = await fetch(`${API_URL}/admin/customers/${customerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('לקוח נמחק בהצלחה!');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) {
      setExpandedOrder(expandedOrder === orderId ? null : orderId);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/details`);
      const data = await response.json();
      setOrderDetails(prev => ({ ...prev, [orderId]: data }));
      setExpandedOrder(orderId);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('הזמנה אושרה!');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('מחק הזמנה?')) return;

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('הזמנה נמחקה!');
        fetchAllData();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f7f3]">
        <div className="text-lg font-bold text-[#2c2416]">טוען...</div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f7f3]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#e8dcc8] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <button
            onClick={onLogout}
            className="text-[#c19a6b] hover:text-[#8b7355] font-bold text-sm uppercase tracking-wider"
          >
            יציאה
          </button>
          <h1 className="text-2xl font-bold text-[#2c2416]" style={{ letterSpacing: '0.05em' }}>
            לוח ניהול
          </h1>
          <div></div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b-2 border-[#e8dcc8] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {[
            { id: 'dashboard', label: 'סטטיסטיקות' },
            { id: 'products', label: 'מוצרים' },
            { id: 'customers', label: 'לקוחות' },
            { id: 'orders', label: 'הזמנות' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 font-bold text-sm border-b-4 transition-all uppercase tracking-wider ${
                activeTab === tab.id
                  ? 'border-[#c19a6b] text-[#c19a6b]'
                  : 'border-transparent text-[#a89080] hover:text-[#2c2416]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { label: 'לקוחות', value: stats.customers, emoji: '👥' },
              { label: 'מוצרים', value: stats.products, emoji: '📦' },
              { label: 'קטגוריות', value: stats.categories, emoji: '📁' },
              { label: 'הזמנות', value: stats.totalOrders, emoji: '🛒' },
              { label: 'הכנסות', value: `₪${stats.totalRevenue.toFixed(0)}`, emoji: '💰' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 border-2 border-[#e8dcc8] hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{stat.emoji}</div>
                <p className="text-xs text-[#a89080] mb-2 uppercase tracking-wider font-bold">{stat.label}</p>
                <p className="text-3xl font-bold text-[#c19a6b]">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-white rounded-xl shadow-md p-8 border-2 border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#2c2416] mb-6 uppercase tracking-wider">הוסף מוצר חדש</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="ID"
                  value={newProduct.itemId}
                  onChange={(e) => setNewProduct({...newProduct, itemId: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                />
                <input
                  type="text"
                  placeholder="שם מוצר"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                />
                <input
                  type="number"
                  placeholder="מחיר"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                />
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-[#c19a6b] hover:bg-[#8b7355] text-white font-bold py-2 rounded-lg transition-all uppercase tracking-wider"
                >
                  הוסף
                </button>
              </form>
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                  <h3 className="text-2xl font-bold text-[#2c2416] mb-6 uppercase tracking-wider text-right">ערוך מוצר</h3>
                  
                  <div className="space-y-4 text-right">
                    <div>
                      <label className="block font-bold text-[#2c2416] mb-2 text-sm uppercase tracking-wider">ID</label>
                      <input
                        type="text"
                        value={editingProduct.itemId}
                        onChange={(e) => setEditingProduct({...editingProduct, itemId: e.target.value})}
                        className="w-full px-4 py-2 border-2 border-[#e8dcc8] rounded-lg focus:outline-none focus:border-[#c19a6b] text-right"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2c2416] mb-2 text-sm uppercase tracking-wider">שם</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                        className="w-full px-4 py-2 border-2 border-[#e8dcc8] rounded-lg focus:outline-none focus:border-[#c19a6b] text-right"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#2c2416] mb-2 text-sm uppercase tracking-wider">מחיר</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                        className="w-full px-4 py-2 border-2 border-[#e8dcc8] rounded-lg focus:outline-none focus:border-[#c19a6b] text-right"
                      />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="bg-[#a89080] hover:bg-[#8b7355] text-white font-bold py-2 px-6 rounded-lg transition-all uppercase tracking-wider"
                      >
                        ביטול
                      </button>
                      <button
                        onClick={handleSaveProduct}
                        className="bg-[#c19a6b] hover:bg-[#8b7355] text-white font-bold py-2 px-6 rounded-lg transition-all uppercase tracking-wider"
                      >
                        שמור
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-md p-8 border-2 border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#2c2416] mb-6 uppercase tracking-wider">כל המוצרים</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#e8dcc8]">
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">פעולות</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">קטגוריה</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">מחיר</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">שם</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className="border-b border-[#e8dcc8] hover:bg-[#f9f7f3]">
                        <td className="py-3 px-4 flex gap-2 justify-end">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            מחק
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="bg-[#c19a6b] hover:bg-[#8b7355] text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            ערוך
                          </button>
                        </td>
                        <td className="py-3 px-4 text-[#a89080]">{product.categoryName}</td>
                        <td className="py-3 px-4 font-bold text-[#c19a6b]">₪{parseFloat(product.price).toFixed(2)}</td>
                        <td className="py-3 px-4 font-bold text-[#2c2416]">{product.name}</td>
                        <td className="py-3 px-4 text-[#a89080]">{product.itemId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[#a89080] text-right text-sm">סה"כ: {products.length} מוצרים</p>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-8">
            {/* Add Customer Form */}
            <div className="bg-white rounded-xl shadow-md p-8 border-2 border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#2c2416] mb-6 uppercase tracking-wider">הוסף לקוח חדש</h3>
              <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="מספר חשבון"
                  value={newCustomer.customerNumber}
                  onChange={(e) => setNewCustomer({...newCustomer, customerNumber: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                />
                <input
                  type="text"
                  placeholder="שם"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                />
                <input
                  type="text"
                  placeholder="כתובת"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                />
                <input
                  type="text"
                  placeholder="עיר"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                  className="px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                />
                <button
                  type="submit"
                  className="bg-[#c19a6b] hover:bg-[#8b7355] text-white font-bold py-2 rounded-lg transition-all uppercase tracking-wider"
                >
                  הוסף
                </button>
              </form>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-md p-8 border-2 border-[#e8dcc8]">
              <h3 className="text-xl font-bold text-[#2c2416] mb-6 uppercase tracking-wider">כל הלקוחות</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#e8dcc8]">
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">פעולות</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">עיר</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">כתובת</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">שם</th>
                      <th className="py-3 px-4 font-bold text-[#2c2416] uppercase tracking-wider">מספר חשבון</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
                      <tr key={customer.id} className="border-b border-[#e8dcc8] hover:bg-[#f9f7f3]">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-bold"
                          >
                            מחק
                          </button>
                        </td>
                        <td className="py-3 px-4 text-[#a89080]">{customer.city}</td>
                        <td className="py-3 px-4 text-[#a89080]">{customer.address}</td>
                        <td className="py-3 px-4 font-bold text-[#2c2416]">{customer.name}</td>
                        <td className="py-3 px-4 text-[#a89080]">{customer.customerNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[#a89080] text-right text-sm">סה"כ: {customers.length} לקוחות</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#2c2416] uppercase tracking-wider">הזמנות</h2>
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-6 border-2 border-[#e8dcc8]">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#2c2416]">{order.orderNumber}</p>
                      <p className="text-sm text-[#a89080]">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-[#c19a6b]">₪{parseFloat(order.totalAmount).toFixed(2)}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        order.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'confirmed' ? 'מאושרת' : 'בהמתנה'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => fetchOrderDetails(order.id)}
                    className="w-full bg-[#f9f7f3] hover:bg-[#e8dcc8] text-[#2c2416] font-bold py-2 px-4 rounded-lg transition mb-4 text-sm uppercase tracking-wider"
                  >
                    {expandedOrder === order.id ? '▼' : '▶'} פרטים
                  </button>

                  {expandedOrder === order.id && orderDetails[order.id] && (
                    <div className="bg-[#f9f7f3] p-4 rounded-lg mb-4 space-y-3 border-2 border-[#e8dcc8]">
                      <div>
                        <h4 className="font-bold mb-2 text-right text-sm uppercase tracking-wider">מוצרים:</h4>
                        {orderDetails[order.id].items?.map(item => (
                          <div key={item.id} className="flex justify-between bg-white p-3 rounded mb-2 text-right text-sm">
                            <span className="text-[#a89080]">{item.quantity} × ₪{parseFloat(item.price).toFixed(2)}</span>
                            <span className="font-bold text-[#2c2416]">{item.productName}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right pt-3 border-t-2 border-[#e8dcc8] text-sm text-[#a89080]">
                        <p>📅 {order.deliveryDate}</p>
                        <p>⏰ {order.deliveryTime}</p>
                        {order.notes && <p>📝 {order.notes}</p>}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmOrder(order.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm uppercase tracking-wider"
                      >
                        אשר
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm uppercase tracking-wider"
                    >
                      מחק
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[#a89080] text-right text-sm">סה"כ: {orders.length} הזמנות</p>
          </div>
        )}
      </div>
    </div>
  );
}