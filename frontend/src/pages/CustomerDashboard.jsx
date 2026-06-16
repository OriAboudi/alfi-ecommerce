import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import logo from '../../assets/logo.jpg';
import ShoppingCart from '../components/ShoppingCart';

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onRemoveFromCart, cartQuantity }) {
  const [quantity, setQuantity] = useState(cartQuantity || 0);

  useEffect(() => {
    setQuantity(cartQuantity || 0);
  }, [cartQuantity]);

  const handleToggleAdd = () => {
    if (quantity === 0) {
      setQuantity(1);
      onAddToCart(product, 1);
    } else {
      setQuantity(0);
      onRemoveFromCart(product.id);
    }
  };

  const handleMinus = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      if (newQty === 0) {
        onRemoveFromCart(product.id);
      } else {
        onAddToCart(product, newQty);
      }
    }
  };

  const handlePlus = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onAddToCart(product, newQty);
  };

  return (
    <div className="bg-white rounded-xl border border-brand-200 overflow-hidden flex flex-row sm:flex-col h-full
      shadow-sm hover:shadow-md hover:border-brand-300 transition-all duration-200 group">
      
      {/* Mini Image Container */}
      <div className="w-28 h-28 min-w-[112px] sm:w-full sm:h-32 flex items-center justify-center relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(148deg, #fdf9f4 0%, #f5ede0 100%)' }}>
        <span className="text-4xl transform group-hover:scale-105 transition-transform duration-200 select-none">📦</span>
      </div>

      {/* Compact Body */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-1.5 min-w-0">
        <div>
          <h3 className="text-xs font-bold text-brand-900 leading-tight line-clamp-2 min-h-[32px] mb-0.5">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-lg font-black text-brand-500 tracking-tight flex items-baseline gap-0.5">
          </p>

          {/* Micro Quantity + Add Actions */}
          <div className="flex items-center gap-1.5 w-full">
            <div className="flex items-center border border-brand-200 rounded-lg overflow-hidden bg-brand-50 h-7 flex-shrink-0">
              <button
                onClick={handleMinus}
                className="w-6 h-full flex items-center justify-center text-brand-400 hover:text-brand-600
                  hover:bg-brand-100 transition-colors text-sm font-bold"
              >−</button>
              <span className="w-7 text-center bg-transparent text-xs font-bold text-brand-900 border-x border-brand-200">
                {quantity}
              </span>
              <button
                onClick={handlePlus}
                className="w-6 h-full flex items-center justify-center text-brand-400 hover:text-brand-600
                  hover:bg-brand-100 transition-colors text-sm font-bold"
              >+</button>
            </div>
            
            <button
              onClick={handleToggleAdd}
              className={`flex-1 h-7 px-2 rounded-lg text-[11px] font-bold text-white transition-all duration-200 truncate ${
                quantity > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-500 hover:bg-brand-600'
              }`}
            >
              {quantity > 0 ? '✓ נוסף' : 'הוסף'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cart Sidebar ───────────────────────────────────────────────
function CartSidebar({ cartItems, onRemove, onUpdateQuantity, onClose, user }) {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity, 0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryDate) { alert('בחר תאריך הספקה'); return; }
    setLoading(true);
    try {
      const itemsToSend = cartItems.map(item => ({
        productId: item.id,
        itemId: item.itemId || item.id,
        productName: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
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
          notes,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('ההזמנה נשלחה בהצלחה! 🎉');
        window.location.href = '/';
      } else {
        alert(`שגיאה: ${data.error || 'שגיאה בשליחת ההזמנה'}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert(`שגיאה בשליחת ההזמנה: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-start" style={{ direction: 'rtl' }}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-brand-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-[440px] h-full flex flex-col shadow-2xl z-10"
        style={{ animation: 'slideInRightrtl .32s cubic-bezier(0.16, 1, 0.3, 1)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-100"
          style={{ background: 'linear-gradient(135deg, #2c2416, #1a1208)' }}>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-white">עגלת קניות</h2>
            <span className="px-2.5 py-0.5 bg-white/10 text-white rounded-full text-xs font-medium">
              {cartItems.length} פריטים
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-white/80 text-xl
              transition-all hover:bg-white/10 hover:text-white"
          >✕</button>
        </div>

        {/* Items Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-brand-300 flex flex-col items-center justify-center h-full">
              <div className="text-5xl mb-4 bg-brand-100 w-20 h-20 flex items-center justify-center rounded-full">🛒</div>
              <p className="text-base font-bold text-brand-800">העגלה שלך ריקה</p>
              <p className="text-xs text-brand-400 mt-1">הוסף מוצרים מהחנות כדי להתחיל הזמנה</p>
            </div>
          ) : cartItems.map(item => (
            <div key={item.id}
              className="flex items-center gap-3 p-3.5 bg-brand-50/50 rounded-xl border border-brand-200 hover:border-brand-300 transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner"
                style={{ background: 'linear-gradient(135deg, #f5ede0, #e8d5b8)' }}>📦</div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-900 leading-tight truncate">{item.name}</p>
                <p className="text-xs text-brand-400 mt-0.5">₪{parseFloat(item.price).toFixed(2)} ליחידה</p>
              </div>

              <div className="flex items-center bg-white border border-brand-200 rounded-lg p-0.5 shadow-sm">
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-brand-500 font-bold text-base
                    hover:bg-brand-50 rounded transition-colors">−</button>
                <span className="w-7 text-center text-sm font-bold text-brand-900">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-brand-500 font-bold text-base
                    hover:bg-brand-50 rounded transition-colors">+</button>
              </div>

              <div className="text-sm font-black text-brand-900 w-16 text-left">
                ₪{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </div>

              <button onClick={() => onRemove(item.id)}
                className="w-8 h-8 flex items-center justify-center text-brand-300 hover:text-red-500
                  hover:bg-red-50 rounded-lg transition-all text-base">🗑</button>
            </div>
          ))}
        </div>

        {/* Order Form & Footer */}
        {cartItems.length > 0 && (
          <form onSubmit={handleSubmit} className="border-t border-brand-200 bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
            <div className="p-5 space-y-4 max-h-[35vh] overflow-y-auto border-b border-brand-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-700 mb-1.5">
                    תאריך הספקה *
                  </label>
                  <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-brand-200 rounded-xl text-sm bg-brand-50/50
                      focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-700 mb-1.5">
                    שעת הספקה
                  </label>
                  <input type="time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-brand-200 rounded-xl text-sm bg-brand-50/50
                      focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-brand-700 mb-1.5">
                  הערות מיוחדות להזמנה
                </label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  rows={2} placeholder="לדוגמה: נא להשאיר ליד הדלת במקרה שאין מענה..."
                  className="w-full px-3 py-2 border border-brand-200 rounded-xl text-sm bg-brand-50/50
                    resize-none focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100
                    transition-all placeholder:text-brand-300" />
              </div>
            </div>

            {/* Total Block */}
            <div className="p-5 bg-brand-50/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-brand-600">סה"כ לתשלום</span>
                <span className="text-3xl font-black text-brand-900 tracking-tight flex items-baseline gap-0.5">
                  <span className="text-lg font-bold">₪</span>
                  {totalAmount.toFixed(2)}
                </span>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl text-base font-extrabold text-white transition-all
                  duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #22a567, #1a9059)',
                  boxShadow: '0 6px 20px rgba(34,165,103,0.3)',
                }}>
                {loading ? 'שולח הזמנה...' : '✓ אישור ושליחת הזמנה'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes slideInRightrtl {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// ── Customer Dashboard ─────────────────────────────────────────
export default function CustomerDashboard({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { if (categories.length > 0 && !selectedCategory) setSelectedCategory(categories[0].id); }, [categories]);
  useEffect(() => { fetchProducts(); }, [selectedCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/products`;
      if (searchTerm) url = `${API_URL}/products/search/${searchTerm}`;
      else if (selectedCategory) url = `${API_URL}/products?categoryId=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddToCart = (product, quantity) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) {
        return prev.map(i => i.id === product.id ? { ...i, quantity } : i);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(i => i.id !== productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) handleRemoveFromCart(productId);
    else setCart(cart.map(i => i.id === productId ? { ...i, quantity } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const getCartQuantity = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#faf8f5] font-sans antialiased">
      {/* Navbar */}
      <header className="bg-white border-b border-brand-100 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95">

        {/* Header Row: Logo, Customer Info, Cart/Logout */}
        <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src={logo} alt="לוגו" className="w-11 h-11 rounded-full object-cover border-2 border-brand-200 shadow-sm" />
            <div className="flex flex-col hidden sm:block">
              <span className="text-base font-black text-brand-900 tracking-tight leading-tight">ח.ס אלפי</span>
              <span className="text-[11px] text-brand-400 font-medium">מערכת הזמנות דיגיטלית</span>
            </div>
          </div>

          {/* Customer Info - CLEAN & MINIMAL */}
          <div className="flex-1 flex justify-center items-center">
            <div className="flex items-center gap-2">
              <span className="text-base">👤</span>
              <span className="text-sm font-black text-brand-900">{user?.name || 'משתמש'}</span>
              {user?.customerNumber && (
                <span className="text-xs text-brand-500 font-semibold">({user.customerNumber})</span>
              )}
            </div>
          </div>

          {/* Cart + Logout */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowCart(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-brand-800
                border border-brand-200 bg-brand-50 hover:bg-brand-100 active:scale-95 transition-all shadow-sm whitespace-nowrap"
            >
              <span className="text-base">🛒</span>
              <span className="hidden sm:inline">עגלה</span>
              {cartCount > 0 && (
                <span className="bg-brand-500 text-white rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-black">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={onLogout}
              className="px-3 py-2 border border-brand-200 rounded-xl text-xs font-bold
                text-brand-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all whitespace-nowrap">
              יציאה
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Sticky Bar with Search (LEFT) + Categories */}
        <div className="bg-white border border-brand-100 rounded-2xl shadow-sm sticky top-24 z-40 p-3">
          <div className="flex gap-3 items-center" style={{ flexDirection: 'row-reverse' }}>
            {/* Search Bar - VISUALLY LEFT */}
            <div className="flex-shrink-0 w-44">
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-300 text-base pointer-events-none">🔍</span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="חפש מוצרים..."
                  className="w-full pr-9 pl-3 py-2.5 border border-brand-200 rounded-lg text-xs bg-brand-50/50
                    focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100
                    transition-all placeholder:text-brand-300 font-medium"
                />
              </div>
            </div>

            {/* Categories Carousel - VISUALLY RIGHT */}
            {!searchTerm ? (
              <div className="flex-1 relative
                before:absolute before:left-0 before:top-0 before:bottom-0 before:w-6 before:bg-gradient-to-r before:from-white before:to-transparent before:pointer-events-none before:z-10
                after:absolute after:right-0 after:top-0 after:bottom-0 after:w-6 after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none after:z-10">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5 px-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setSearchTerm(''); }}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap
                        border transition-all duration-200 ${
                        selectedCategory === cat.id
                          ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20'
                          : 'bg-brand-50/60 text-brand-700 border-brand-200 hover:bg-brand-100/80 hover:border-brand-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 text-center text-brand-500 text-sm font-medium py-2">
                <span>חיפוש עבור: <strong className="text-brand-900">"{searchTerm}"</strong></span>
              </div>
            )}

            {/* Clear Search Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold text-brand-400 hover:text-red-600
                  hover:bg-red-50/50 border border-brand-200 transition-all whitespace-nowrap"
              >
                ✕ בטל
              </button>
            )}
          </div>
        </div>

        {/* Responsive Grid Layout for Products */}
        <div className="py-2">
          {loading ? (
            <div className="text-center py-24 text-brand-400 font-medium flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">טוען קטלוג מוצרים...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-brand-100 shadow-sm text-brand-400">
              <span className="text-4xl block mb-3">🔍</span>
              <p className="text-base font-bold text-brand-800">לא נמצאו מוצרים תואמים</p>
              <p className="text-xs mt-1">נסה לשנות את מילת החיפוש או לבחור קטגוריה אחרת</p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 sm:gap-6">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                  cartQuantity={getCartQuantity(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Shopping Cart Full Page */}
      {showCart && (
        <ShoppingCart
          cartItems={cart}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onBack={() => setShowCart(false)}
          onSubmit={async (formData) => {
            try {
              const itemsToSend = cart.map(item => ({
                productId: item.id,
                itemId: item.itemId || item.id,
                productName: item.name,
                price: parseFloat(item.price),
                quantity: item.quantity,
              }));
              const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customerId: user.id,
                  customerNumber: user.customerNumber,
                  items: itemsToSend,
                  deliveryDate: formData.deliveryDate,
                  deliveryTime: formData.deliveryTime,
                  notes: formData.notes,
                }),
              });
              const data = await response.json();
              if (response.ok) {
                alert('ההזמנה נשלחה בהצלחה! 🎉');
                setShowCart(false);
                setCart([]);
              } else {
                alert(`שגיאה: ${data.error || 'שגיאה בשליחת ההזמנה'}`);
              }
            } catch (error) {
              console.error('Order submission error:', error);
              alert(`שגיאה בשליחת ההזמנה: ${error.message}`);
            }
          }}
          customerInfo={user}
        />
      )}
    </div>
  );
}