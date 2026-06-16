import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const [summary, setSummary] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchSummary();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/details`);
      const data = await response.json();
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: data
      }));
    } catch (err) {
      console.error('Error fetching order details:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/orders/summary/by-date`);
      const data = await response.json();
      setSummary(data.summary || []);
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
        method: 'POST'
      });
      if (response.ok) {
        alert('הזמנה אושרה!');
        fetchOrders();
      }
    } catch (err) {
      console.error('Error confirming order:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('הוא בטוח?')) return;
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('הזמנה נמחקה!');
        fetchOrders();
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const handleExpandOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      if (!orderDetails[orderId]) {
        fetchOrderDetails(orderId);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-600">טוען הזמנות...</div>;
  }

  const filteredOrders = activeTab === 'all'
    ? orders
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-right">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ניהול הזמנות</h2>
        <p className="text-gray-600 mt-1">סה"כ הזמנות: {orders.length}</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 border-b-2 border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-3 font-semibold whitespace-nowrap transition-all duration-200 ${
            activeTab === 'all'
              ? 'border-b-3 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          הכל <span className="text-sm">({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 font-semibold whitespace-nowrap transition-all duration-200 ${
            activeTab === 'pending'
              ? 'border-b-3 border-yellow-500 text-yellow-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          בהמתנה <span className="text-sm">({orders.filter(o => o.status === 'pending').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-4 py-3 font-semibold whitespace-nowrap transition-all duration-200 ${
            activeTab === 'confirmed'
              ? 'border-b-3 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          מאושרות <span className="text-sm">({orders.filter(o => o.status === 'confirmed').length})</span>
        </button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-4 md:gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            אין הזמנות בקטגוריה זו
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${
                order.status === 'confirmed'
                  ? 'border-l-green-500 bg-gradient-to-r from-green-50 to-white'
                  : 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-white'
              }`}
            >
              {/* Order Header */}
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="text-right flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">
                        {order.orderNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-bold ${
                        order.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status === 'confirmed' ? '✓ מאושרת' : '⏳ בהמתנה'}
                      </span>
                    </div>
                    <p className="text-gray-700 font-semibold">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      מספר לקוח: {order.customerNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      ₪{parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">סכום כולל</p>
                  </div>
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => handleExpandOrder(order.id)}
                  className="w-full mt-4 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <span>{expandedOrder === order.id ? '▼' : '▶'}</span>
                  <span>פרטי הזמנה</span>
                </button>
              </div>

              {/* Order Details - Expanded */}
              {expandedOrder === order.id && orderDetails[order.id] && (
                <div className="bg-gray-50 border-t border-gray-200 p-4 md:p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 text-right">
                      📦 מוצרים בהזמנה
                    </h4>
                    <div className="space-y-2">
                      {orderDetails[order.id].items?.map(item => (
                        <div
                          key={item.id}
                          className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-right"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600">
                              ₪{parseFloat(item.price).toFixed(2)} × {item.quantity} מוצרים
                            </p>
                          </div>
                          <p className="font-bold text-blue-600 text-lg">
                            ₪{parseFloat(item.subtotal).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-semibold">📅 תאריך הספקה</p>
                        <p className="font-semibold text-gray-900 mt-1">{order.deliveryDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-semibold">🕐 שעת הספקה</p>
                        <p className="font-semibold text-gray-900 mt-1">{order.deliveryTime || 'לא צוינה'}</p>
                      </div>
                    </div>
                    {order.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200 text-right">
                        <p className="text-xs text-gray-600 font-semibold">📝 הערות</p>
                        <p className="text-gray-700 mt-1">{order.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-right text-sm text-gray-600 font-semibold">סה"כ להזמנה:</p>
                    <p className="text-right text-2xl font-bold text-blue-600 mt-1">
                      ₪{parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-gray-100 px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleConfirmOrder(order.id)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    ✓ אשר הזמנה
                  </button>
                )}
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  🗑️ מחק
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Section */}
      {summary.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-right">
            📊 סיכום הזמנות לפי תאריך
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {summary.map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-5 md:p-6 text-right hover:shadow-xl transition-shadow duration-300"
              >
                <p className="text-sm font-semibold opacity-90">
                  📅 {item.deliveryDate}
                </p>
                {item.deliveryTime && (
                  <p className="text-xs opacity-75">שעה: {item.deliveryTime}</p>
                )}
                <p className="text-3xl md:text-4xl font-bold mt-3">
                  {item.orderCount}
                </p>
                <p className="text-sm opacity-90 mt-1">הזמנות</p>
                <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                  <p className="text-lg font-bold">₪{parseFloat(item.totalAmount).toFixed(2)}</p>
                  <p className="text-xs opacity-75 mt-1">
                    ✓ {item.confirmedCount} מאושרות
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
