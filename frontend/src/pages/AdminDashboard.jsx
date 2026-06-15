import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ customers: 0, products: 0, categories: 0, totalOrders: 0, totalRevenue: 0 });
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ itemId: '', name: '', price: '', categoryId: '' });
  const [newCustomer, setNewCustomer] = useState({ customerNumber: '', name: '', address: '', city: '', phone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sR, cR, pR, catR, oR] = await Promise.all([
        fetch(`${API_URL}/admin/dashboard/stats`),
        fetch(`${API_URL}/customers`),
        fetch(`${API_URL}/admin/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/orders`),
      ]);
      if (sR.ok) setStats((await sR.json()).stats);
      if (cR.ok) setCustomers((await cR.json()).customers || []);
      if (pR.ok) setProducts((await pR.json()).products || []);
      if (catR.ok) setCategories((await catR.json()).categories || []);
      if (oR.ok) setOrders((await oR.json()).orders || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.itemId || !newProduct.name || !newProduct.price || !newProduct.categoryId) {
      alert('אנא מלא את כל השדות'); return;
    }
    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: newProduct.itemId, name: newProduct.name, price: parseFloat(newProduct.price), categoryId: parseInt(newProduct.categoryId) }),
      });
      if (res.ok) { alert('מוצר נוסף בהצלחה!'); setNewProduct({ itemId: '', name: '', price: '', categoryId: '' }); fetchAllData(); }
    } catch { alert('שגיאה בהוספת מוצר'); }
  };

  const handleSaveProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${editingProduct.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: editingProduct.itemId, name: editingProduct.name, price: parseFloat(editingProduct.price), categoryId: editingProduct.categoryId }),
      });
      if (res.ok) { alert('מוצר עודכן!'); setEditingProduct(null); fetchAllData(); }
    } catch { alert('שגיאה'); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('למחוק?')) return;
    try { const res = await fetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE' }); if (res.ok) { alert('נמחק!'); fetchAllData(); } } catch {}
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.customerNumber || !newCustomer.name) { alert('מלא שדות חובה'); return; }
    try {
      const res = await fetch(`${API_URL}/admin/customers`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerNumber: newCustomer.customerNumber, customerName: newCustomer.name, address: newCustomer.address, city: newCustomer.city, phone1: newCustomer.phone }),
      });
      if (res.ok) { alert('לקוח נוסף!'); setNewCustomer({ customerNumber: '', name: '', address: '', city: '', phone: '' }); fetchAllData(); }
    } catch { alert('שגיאה'); }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm('למחוק?')) return;
    try { const res = await fetch(`${API_URL}/admin/customers/${id}`, { method: 'DELETE' }); if (res.ok) { alert('נמחק!'); fetchAllData(); } } catch {}
  };

  const fetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) { setExpandedOrder(expandedOrder === orderId ? null : orderId); return; }
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/details`);
      const data = await res.json();
      setOrderDetails(prev => ({ ...prev, [orderId]: data }));
      setExpandedOrder(orderId);
    } catch { console.error('Error'); }
  };

  const handleConfirmOrder = async (id) => {
    try { const res = await fetch(`${API_URL}/orders/${id}/confirm`, { method: 'POST' }); if (res.ok) { alert('הזמנה אושרה!'); fetchAllData(); } } catch {}
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('למחוק?')) return;
    try { const res = await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' }); if (res.ok) { alert('נמחקה!'); fetchAllData(); } } catch {}
  };

  const inputCls = "w-full px-3.5 py-2.5 border-[1.5px] border-brand-200 rounded-lg text-sm bg-brand-50 text-right focus:outline-none focus:border-brand-500 focus:ring-[3px] focus:ring-brand-100 transition-all";
  const tabs = [
    { id: 'dashboard', label: 'סטטיסטיקות' },
    { id: 'products', label: 'מוצרים' },
    { id: 'customers', label: 'לקוחות' },
    { id: 'orders', label: 'הזמנות' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-brand-50">
      <p className="text-brand-400 font-semibold text-lg">טוען...</p>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-brand-50">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-7 sticky top-0 z-50"
        style={{ background: 'linear-gradient(135deg, #2c2416, #1a1208)' }}>
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">📊</span>
          <span className="text-[17px] font-extrabold text-white tracking-tight">לוח ניהול — ח.ס אלפי</span>
        </div>
        <button onClick={onLogout}
          className="px-4 py-1.5 rounded-md text-xs font-semibold text-white/75 border border-white/20
            bg-white/10 hover:bg-white/20 hover:text-white transition-all">
          יציאה
        </button>
      </header>

      {/* Tab strip */}
      <div className="bg-white border-b border-brand-200 px-7 sticky top-16 z-40 shadow-warm-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-shrink-0 px-5 py-4 text-[13px] font-bold border-b-[3px] transition-all duration-200 whitespace-nowrap -mb-px ${
                activeTab === t.id ? 'border-brand-500 text-brand-500' : 'border-transparent text-brand-300 hover:text-brand-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-7 py-7">

        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-7">
              {[
                { l: 'לקוחות', v: stats.customers, i: '👥' },
                { l: 'מוצרים', v: stats.products, i: '📦' },
                { l: 'קטגוריות', v: stats.categories, i: '📁' },
                { l: 'הזמנות', v: stats.totalOrders, i: '🛒' },
                { l: 'הכנסות', v: `₪${(stats.totalRevenue || 0).toFixed(0)}`, i: '💰' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border border-brand-200 p-5 relative overflow-hidden shadow-warm-sm hover:-translate-y-1 hover:shadow-warm-md transition-all duration-250">
                  <div className="absolute top-4 left-3 text-[26px] opacity-10">{s.i}</div>
                  <p className="text-[11px] font-bold text-brand-300 uppercase tracking-wide mb-2">{s.l}</p>
                  <p className="text-3xl font-black text-brand-900 tracking-tight leading-none">{s.v}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-[3px]"
                    style={{ background: 'linear-gradient(90deg, #b87c4a, #8a5c32)' }} />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-brand-200 shadow-warm-sm p-6">
              <h3 className="text-[15px] font-extrabold text-brand-900 mb-3">ברוכים הבאים</h3>
              <p className="text-sm text-brand-600 leading-relaxed">ברוכים הבאים למערכת הניהול של ח.ס אלפי. השתמשו בטאבים שלמעלה כדי לנהל לקוחות, מוצרים והזמנות.</p>
            </div>
          </>
        )}

        {/* ── PRODUCTS ── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Add form */}
            <div className="bg-white rounded-xl border border-brand-200 shadow-warm-sm p-6">
              <h3 className="text-[15px] font-extrabold text-brand-900 mb-5">הוסף מוצר חדש</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input className={inputCls} placeholder="ID מוצר" value={newProduct.itemId} onChange={e => setNewProduct({ ...newProduct, itemId: e.target.value })} />
                <input className={inputCls} placeholder="שם מוצר" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                <input className={inputCls} type="number" placeholder="מחיר" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                <select className={inputCls} value={newProduct.categoryId} onChange={e => setNewProduct({ ...newProduct, categoryId: e.target.value })}>
                  <option value="">בחר קטגוריה</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="submit" className="py-2.5 rounded-lg text-sm font-bold text-white transition-colors"
                  style={{ background: 'linear-gradient(135deg, #b87c4a, #8a5c32)' }}>+ הוסף</button>
              </form>
            </div>

            {/* Edit modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-brand-900/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-warm-lg p-8 w-full max-w-md">
                  <h3 className="text-xl font-extrabold text-brand-900 mb-6 text-right">ערוך מוצר</h3>
                  <div className="space-y-4 text-right">
                    {[['itemId','ID'],['name','שם'],['price','מחיר']].map(([k,l]) => (
                      <div key={k}>
                        <label className="block text-xs font-bold text-brand-600 mb-1.5">{l}</label>
                        <input className={inputCls} value={editingProduct[k]} onChange={e => setEditingProduct({ ...editingProduct, [k]: e.target.value })} />
                      </div>
                    ))}
                    <div className="flex gap-2 justify-end pt-2">
                      <button onClick={() => setEditingProduct(null)}
                        className="px-5 py-2 rounded-lg text-sm font-bold text-brand-600 border-[1.5px] border-brand-200 hover:bg-brand-50 transition-colors">ביטול</button>
                      <button onClick={handleSaveProduct}
                        className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-colors"
                        style={{ background: 'linear-gradient(135deg, #b87c4a, #8a5c32)' }}>שמור</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-brand-200 shadow-warm-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-200">
                <span className="text-[15px] font-extrabold text-brand-900">כל המוצרים</span>
                <span className="text-sm text-brand-300">{products.length} פריטים</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-50 border-b border-brand-200">
                      {['פעולות','קטגוריה','מחיר','שם','ID'].map(h => (
                        <th key={h} className="py-3 px-4 text-right text-[11px] font-bold text-brand-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-brand-100 hover:bg-brand-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex gap-1.5 justify-end">
                            <button onClick={() => setEditingProduct({ ...p })}
                              className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-[11px] font-bold hover:bg-blue-100 transition-colors">✏️ ערוך</button>
                            <button onClick={() => handleDeleteProduct(p.id)}
                              className="px-2.5 py-1 bg-red-50 text-red-500 rounded text-[11px] font-bold hover:bg-red-100 transition-colors">🗑 מחק</button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[12px] text-brand-400">{p.categoryName}</td>
                        <td className="py-3 px-4 font-extrabold text-brand-500">₪{parseFloat(p.price).toFixed(2)}</td>
                        <td className="py-3 px-4 font-bold text-brand-900">{p.name}</td>
                        <td className="py-3 px-4 text-[12px] text-brand-400">{p.itemId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-brand-200 shadow-warm-sm p-6">
              <h3 className="text-[15px] font-extrabold text-brand-900 mb-5">הוסף לקוח חדש</h3>
              <form onSubmit={handleAddCustomer} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <input className={inputCls} placeholder="מספר חשבון *" value={newCustomer.customerNumber} onChange={e => setNewCustomer({ ...newCustomer, customerNumber: e.target.value })} />
                <input className={inputCls} placeholder="שם *" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                <input className={inputCls} placeholder="כתובת" value={newCustomer.address} onChange={e => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                <input className={inputCls} placeholder="עיר" value={newCustomer.city} onChange={e => setNewCustomer({ ...newCustomer, city: e.target.value })} />
                <button type="submit" className="py-2.5 rounded-lg text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #b87c4a, #8a5c32)' }}>+ הוסף</button>
              </form>
            </div>
            <div className="bg-white rounded-xl border border-brand-200 shadow-warm-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-200">
                <span className="text-[15px] font-extrabold text-brand-900">כל הלקוחות</span>
                <span className="text-sm text-brand-300">{customers.length} לקוחות</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-50 border-b border-brand-200">
                      {['פעולות','עיר','כתובת','שם','מספר חשבון'].map(h => (
                        <th key={h} className="py-3 px-4 text-right text-[11px] font-bold text-brand-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id} className="border-b border-brand-100 hover:bg-brand-50 transition-colors">
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteCustomer(c.id)}
                            className="px-2.5 py-1 bg-red-50 text-red-500 rounded text-[11px] font-bold hover:bg-red-100 transition-colors">🗑 מחק</button>
                        </td>
                        <td className="py-3 px-4 text-[12px] text-brand-400">{c.city}</td>
                        <td className="py-3 px-4 text-[13px] text-brand-400">{c.address}</td>
                        <td className="py-3 px-4 font-bold text-brand-900">{c.name}</td>
                        <td className="py-3 px-4 text-[12px] text-brand-400">{c.customerNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-[17px] font-extrabold text-brand-900">הזמנות</h2>
              <span className="text-sm text-brand-400">{orders.length} הזמנות</span>
            </div>
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl border border-brand-200 overflow-hidden shadow-warm-sm">
                  <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-brand-50 transition-colors"
                    onClick={() => fetchOrderDetails(order.id)}>
                    <div>
                      <p className="text-sm font-extrabold text-brand-900">{order.orderNumber}</p>
                      <p className="text-[12px] text-brand-400 mt-0.5">{order.customerName} · {order.deliveryDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-brand-500 tracking-tight">₪{parseFloat(order.totalAmount).toFixed(2)}</span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {order.status === 'confirmed' ? '✓ מאושרת' : '⏳ בהמתנה'}
                      </span>
                      <span className="text-brand-300 text-sm">{expandedOrder === order.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedOrder === order.id && orderDetails[order.id] && (
                    <div className="px-5 py-4 border-t border-brand-100 bg-brand-50">
                      <div className="space-y-2">
                        {orderDetails[order.id].items?.map(item => (
                          <div key={item.id} className="flex justify-between items-center bg-white px-4 py-2.5 rounded-lg border border-brand-200 text-sm">
                            <div>
                              <span className="font-bold text-brand-900">{item.productName}</span>
                              <span className="text-brand-300 text-[11px] mr-2">×{item.quantity}</span>
                            </div>
                            <span className="font-extrabold text-brand-500">₪{parseFloat(item.subtotal).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.notes && (
                          <div className="bg-white px-4 py-2.5 rounded-lg border border-brand-200 text-sm text-brand-600 mt-2">
                            📝 {order.notes}
                          </div>
                        )}
                        {order.deliveryTime && (
                          <p className="text-[12px] text-brand-400">⏰ {order.deliveryTime}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end px-5 py-3 bg-white border-t border-brand-100">
                    {order.status === 'pending' && (
                      <button onClick={() => handleConfirmOrder(order.id)}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-green-500 hover:bg-green-600 transition-colors">
                        ✓ אשר הזמנה
                      </button>
                    )}
                    <button onClick={() => handleDeleteOrder(order.id)}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                      🗑 מחק
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
