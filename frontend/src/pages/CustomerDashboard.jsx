import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export default function CustomerDashboard({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);  

  useEffect(() => {
    if (categories.length > 0) {
      if (!selectedCategory) {
        setSelectedCategory(categories[0].id);
      }
    }
  }, [categories]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/products`;
      
      if (searchTerm) {
        url = `${API_URL}/products/search/${searchTerm}`;
      } else if (selectedCategory) {
        url = `${API_URL}/products?categoryId=${selectedCategory}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f9f7f3]">
      {/* Header/Navbar */}
      <header className="bg-white border-b-2 border-[#e8dcc8] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowCart(true)}
              className="relative text-3xl hover:scale-110 transition-transform"
            >
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-[#c19a6b] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-[#2c2416]" style={{ letterSpacing: '0.05em' }}>
              אלפי ח.ס
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="text-[#a89080] hover:text-[#c19a6b] font-bold transition-colors text-sm uppercase tracking-wider"
          >
            יציאה
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b-2 border-[#e8dcc8]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חיפוש מוצרים..."
            className="w-full px-6 py-3 border-2 border-[#e8dcc8] rounded-lg focus:outline-none focus:border-[#c19a6b] text-right text-sm"
          />
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white border-b-2 border-[#e8dcc8] sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchTerm('');
                }}
                className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all uppercase tracking-wider ${
                  selectedCategory === category.id
                    ? 'bg-[#c19a6b] text-white shadow-md'
                    : 'bg-[#f9f7f3] text-[#2c2416] hover:bg-[#e8dcc8]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#a89080]">טוען מוצרים...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#a89080]">לא נמצאו מוצרים</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <CartSidebar
          cartItems={cart}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClose={() => setShowCart(false)}
          user={user}
        />
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group border-2 border-[#e8dcc8]">
      {/* Product Image */}
      <div className="h-40 bg-gradient-to-br from-[#f9f7f3] to-[#e8dcc8] flex items-center justify-center text-gray-400 relative overflow-hidden">
        <div className="text-4xl opacity-30">📦</div>
        <div className="absolute top-3 right-3 bg-[#c19a6b] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          זמינה
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-[#2c2416] text-xs mb-3 text-right line-clamp-2 min-h-8">
          {product.name}
        </h3>

        {/* Price */}
        <div className="text-right mb-4">
          <p className="text-xl font-bold text-[#c19a6b]">
            ₪{parseFloat(product.price).toFixed(2)}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4 bg-[#f9f7f3] rounded-lg p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-[#a89080] hover:text-[#c19a6b] font-bold w-7 text-center transition-colors"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-8 text-center bg-transparent font-bold text-[#2c2416] text-sm"
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="text-[#a89080] hover:text-[#c19a6b] font-bold w-7 text-center transition-colors"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => {
            onAddToCart(product, quantity);
            setQuantity(1);
          }}
          className="w-full bg-[#c19a6b] hover:bg-[#8b7355] text-white font-bold py-2 px-3 rounded-lg transition-all text-xs uppercase tracking-wider"
        >
          הוסף לעגלה
        </button>
      </div>
    </div>
  );
}

function CartSidebar({ cartItems, onRemove, onUpdateQuantity, onClose, user }) {
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
    try {
      const itemsToSend = cartItems.map(item => ({
        productId: item.id,
        itemId: item.itemId || item.id,
        productName: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity
      }));

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          customerNumber: user.customerNumber,
          items: itemsToSend,
          deliveryDate,
          deliveryTime,
          notes
        })
      });

      if (response.ok) {
        alert('ההזמנה נשלחה בהצלחה!');
        window.location.href = '/';
      }
    } catch (err) {
      alert('שגיאה בשליחת ההזמנה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-[#2c2416] text-white p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-white hover:text-[#c19a6b] font-bold text-2xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold">עגלת קניות</h2>
          </div>
        </div>

        {/* Cart Items */}
        <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-center text-[#a89080] py-8">העגלה ריקה</p>
          ) : (
            cartItems.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-[#f9f7f3] p-4 rounded-lg border-2 border-[#e8dcc8]"
              >
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >
                  🗑️
                </button>

                <div className="text-right flex-1 mx-3">
                  <p className="font-bold text-sm text-[#2c2416]">{item.name}</p>
                  <p className="text-xs text-[#a89080]">
                    ₪{parseFloat(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center bg-white border-2 border-[#e8dcc8] rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-2 text-[#c19a6b] font-bold text-sm"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    className="w-8 text-center bg-transparent font-bold text-[#2c2416] text-xs"
                  />
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-2 text-[#c19a6b] font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <div className="text-right ml-3 font-bold text-[#c19a6b] w-16 text-sm">
                  ₪{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Form */}
        {cartItems.length > 0 && (
          <form onSubmit={handleSubmit} className="p-6 border-t-2 border-[#e8dcc8] space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2c2416] mb-2 uppercase tracking-wider">
                תאריך הספקה
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2c2416] mb-2 uppercase tracking-wider">
                שעת הספקה
              </label>
              <input
                type="time"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2c2416] mb-2 uppercase tracking-wider">
                הערות
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#e8dcc8] rounded-lg text-right text-sm focus:outline-none focus:border-[#c19a6b]"
                rows="3"
              />
            </div>

            <div className="bg-[#f9f7f3] p-4 rounded-lg border-2 border-[#e8dcc8]">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#c19a6b]">
                  ₪{totalAmount.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-[#2c2416] uppercase tracking-wider">סה"כ:</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c19a6b] hover:bg-[#8b7355] text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 uppercase tracking-wider"
            >
              {loading ? 'שולח...' : 'שלח הזמנה'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}