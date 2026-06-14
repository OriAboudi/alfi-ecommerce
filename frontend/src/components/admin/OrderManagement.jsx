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
      // Fetch details when expanding
      if (!orderDetails[orderId]) {
        fetchOrderDetails(orderId);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">טוען הזמנות...</div>;
  }

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">ניהול הזמנות</h2>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          הכל ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          בהמתנה ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'confirmed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          מאושרות ({orders.filter(o => o.status === 'confirmed').length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-right">{order.orderNumber}</h3>
                <p className="text-sm text-gray-600 text-right">
                  {order.customerName} ({order.customerNumber})
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₪{parseFloat(order.totalAmount).toFixed(2)}</p>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  order.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'confirmed' ? '✓ מאושרת' : '⏳ בהמתנה'}
                </span>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => handleExpandOrder(order.id)}
              className="w-full text-right px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded transition mb-4"
            >
              {expandedOrder === order.id ? '▼' : '▶'} פרטי הזמנה
            </button>

            {/* Order Details */}
            {expandedOrder === order.id && orderDetails[order.id] && (
              <div className="bg-gray-50 p-4 rounded mb-4">
                <h4 className="font-bold mb-3 text-right">מוצרים בהזמנה:</h4>
                <div className="space-y-2 mb-4">
                  {orderDetails[order.id].items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded text-right">
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-sm text-gray-600">₪{parseFloat(item.price).toFixed(2)} × {item.quantity} = ₪{parseFloat(item.subtotal).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-3 rounded mb-4 text-right border-t-2">
                  <p className="font-bold">סה"כ: ₪{parseFloat(order.totalAmount).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">תאריך הספקה: {order.deliveryDate} {order.deliveryTime}</p>
                  {order.notes && <p className="text-sm text-gray-600">הערות: {order.notes}</p>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              {order.status === 'pending' && (
                <button
                  onClick={() => handleConfirmOrder(order.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                >
                  אשר הזמנה
                </button>
              )}
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
              >
                מחק
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {summary.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-right">סיכום הזמנות לפי תאריך</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.map((item, idx) => (
              <div key={idx} className="bg-blue-50 rounded p-4">
                <p className="text-sm font-semibold text-gray-600 text-right">
                  {item.deliveryDate} {item.deliveryTime && `- ${item.deliveryTime}`}
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2 text-right">
                  {item.orderCount} הזמנות
                </p>
                <p className="text-sm text-gray-600 mt-1 text-right">
                  סה"כ: ₪{parseFloat(item.totalAmount).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 text-right">
                  מאושרות: {item.confirmedCount}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}