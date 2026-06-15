import React, { useState } from 'react';

export default function ShoppingCart({
  cartItems,
  onRemove,
  onUpdateQuantity,
  onSubmit,
  onBack,
  customerInfo
}) {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!deliveryDate) {
      alert('בחר תאריך הספקה');
      return;
    }

    setLoading(true);
    await onSubmit({ deliveryDate, deliveryTime, notes });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-semibold text-lg"
          >
            ← חזור
          </button>
          <h1 className="text-2xl font-bold text-green-900">עגלת קניות</h1>
          <div></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-right text-green-900 mb-6">
                המוצרים שלך
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">העגלה ריקה</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                    >
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                      >
                        🗑️
                      </button>

                      <div className="text-right flex-1 mx-4">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          ₪{parseFloat(item.price).toFixed(2)} ליחידה
                        </p>
                      </div>

                      <div className="flex items-center bg-white border-2 border-green-200 rounded-lg p-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-600 hover:text-gray-900 font-bold w-6"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            onUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-8 text-center bg-transparent font-semibold"
                        />
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-600 hover:text-gray-900 font-bold w-6"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right ml-4 font-bold text-green-700 w-20">
                        ₪{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Delivery */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-right text-green-900 mb-6">
                סיכום הזמנה
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Delivery Date */}
                <div className="text-right">
                  <label className="block font-semibold text-gray-700 mb-2">
                    תאריך הספקה
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-green-200 rounded-lg text-right"
                    required
                  />
                </div>

                {/* Delivery Time */}
                <div className="text-right">
                  <label className="block font-semibold text-gray-700 mb-2">
                    שעת הספקה (אופציונלי)
                  </label>
                  <input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-green-200 rounded-lg text-right"
                  />
                </div>

                {/* Notes */}
                <div className="text-right">
                  <label className="block font-semibold text-gray-700 mb-2">
                    הערות (אופציונלי)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-green-200 rounded-lg text-right"
                    rows="3"
                    placeholder="הוסף הערות..."
                  ></textarea>
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-green-700">
                      ₪{totalAmount.toFixed(2)}
                    </span>
                    <span className="text-lg font-semibold text-gray-700">
                      סה"כ:
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'שולח...' : '✓ שלח הזמנה'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}