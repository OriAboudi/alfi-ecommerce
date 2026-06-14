import React, { useState } from 'react';

export default function ShoppingCart({ cartItems, onRemove, onUpdateQuantity, onSubmit, customerInfo }) {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) * item.quantity),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deliveryDate) {
      alert('בחר תאריך הספקה');
      return;
    }

    setSubmitting(true);
    await onSubmit({
      deliveryDate,
      deliveryTime,
      notes
    });
    setSubmitting(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 text-lg mb-4">העגלה ריקה</p>
        <p className="text-gray-500">בחר מוצרים כדי להוסיף להזמנה</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-right">עגלת קניות</h2>

      {/* Cart Items */}
      <div className="mb-6 border-b pb-6">
        <h3 className="font-semibold text-lg mb-4 text-right">מוצרים בהזמנה:</h3>
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded">
              <button
                onClick={() => onRemove(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                ✕ הסר
              </button>

              <div className="flex-1 text-right">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">₪{parseFloat(item.price).toFixed(2)} ליחידה</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                  className="w-12 text-center border border-gray-300 rounded py-1"
                  min="1"
                />
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
                >
                  +
                </button>
              </div>

              <div className="text-right font-semibold w-24">
                ₪{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">סה"כ:</span>
          <span className="text-2xl font-bold text-blue-600">₪{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>מוצרים: {cartItems.length}</span>
          <span>יחידות: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-right">תאריך הספקה:</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-right">שעת הספקה:</label>
          <select
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">בחר שעה</option>
            <option value="08:00">08:00 - 09:00</option>
            <option value="09:00">09:00 - 10:00</option>
            <option value="10:00">10:00 - 11:00</option>
            <option value="11:00">11:00 - 12:00</option>
            <option value="12:00">12:00 - 13:00</option>
            <option value="13:00">13:00 - 14:00</option>
            <option value="14:00">14:00 - 15:00</option>
            <option value="15:00">15:00 - 16:00</option>
            <option value="16:00">16:00 - 17:00</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-right">הערות:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="הערות או בקשות מיוחדות"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            rows="3"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="font-semibold mb-2 text-right">פרטי חשבון:</h4>
          <p className="text-sm text-gray-700 text-right">שם: {customerInfo.name}</p>
          <p className="text-sm text-gray-700 text-right">חשבון: {customerInfo.customerNumber}</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition disabled:bg-gray-400"
        >
          {submitting ? 'שומר הזמנה...' : '✓ שלח הזמנה'}
        </button>
      </form>
    </div>
  );
}
