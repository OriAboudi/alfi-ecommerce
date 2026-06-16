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
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-brand-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-brand-600 hover:text-brand-900 font-semibold text-base sm:text-lg px-3 py-2"
          >
            ← חזור
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-900">🛒 עגלת קניות</h1>
          <div></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-right text-brand-900 mb-6">
                המוצרים שלך
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-base sm:text-lg">העגלה ריקה</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-brand-50 p-3 sm:p-4 rounded-lg"
                    >
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                      >
                        🗑️
                      </button>

                      <div className="text-right flex-1 w-full sm:mx-4">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{item.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          ₪{parseFloat(item.price).toFixed(2)} ליחידה
                        </p>
                      </div>

                      <div className="flex items-center bg-white border-2 border-brand-200 rounded-lg p-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="text-gray-600 hover:text-gray-900 font-bold w-6 text-center"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            onUpdateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-8 text-center bg-transparent font-semibold text-base"
                          style={{ fontSize: '16px' }}
                          min="1"
                        />
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-600 hover:text-gray-900 font-bold w-6 text-center"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right font-bold text-brand-700 w-full sm:w-auto sm:ml-4">
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
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sticky top-20">
              <h2 className="text-lg sm:text-xl font-bold text-right text-brand-900 mb-6">
                📋 סיכום הזמנה
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Delivery Date */}
                <div className="text-right">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                    📅 תאריך הספקה *
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-brand-200 rounded-lg text-right text-base sm:text-base"
                    style={{ fontSize: '16px' }}
                    required
                  />
                </div>

                {/* Delivery Time */}
                <div className="text-right">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                    🕐 שעת הספקה (אופציונלי)
                  </label>
                  <input
                    type="time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-brand-200 rounded-lg text-right text-base sm:text-base"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                {/* Notes */}
                <div className="text-right">
                  <label className="block font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                    📝 הערות (אופציונלי)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-brand-200 rounded-lg text-right text-base"
                    style={{ fontSize: '16px' }}
                    rows="3"
                    placeholder="הוסף הערות..."
                  ></textarea>
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg sm:text-xl font-bold text-brand-700">
                      ₪{totalAmount.toFixed(2)}
                    </span>
                    <span className="text-base sm:text-lg font-semibold text-gray-700">
                      סה"כ:
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold py-3 px-4 sm:py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
                  >
                    {loading ? '⏳ שולח...' : '✓ שלח הזמנה'}
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
