import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import ShoppingCart from '../components/ShoppingCart';

export default function CustomerDashboard({ user, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_URL}/products`;
        
        if (selectedCategory) {
          url += `?categoryId=${selectedCategory}`;
        } else if (searchTerm) {
          url = `${API_URL}/products/search/${searchTerm}`;
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

    const delaySearch = setTimeout(fetchProducts, 300);
    return () => clearTimeout(delaySearch);
  }, [selectedCategory, searchTerm]);

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

  const handleOrderSubmit = async (orderData) => {
    try {
      // Map cart items to include all required fields
      const itemsToSend = cart.map(item => ({
        productId: item.id,                    // Product ID from database
        itemId: item.itemId || item.id,        // Item ID (could be custom item_id)
        productName: item.name,                // Product name
        price: parseFloat(item.price),         // Price
        quantity: item.quantity                // Quantity
      }));

      console.log('Sending order with items:', itemsToSend);

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          customerNumber: user.customerNumber,
          items: itemsToSend,
          ...orderData
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('ההזמנה נשלחה בהצלחה!');
        setCart([]);
        setShowCart(false);
      } else {
        alert('שגיאה בשליחת ההזמנה: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('שגיאה בחיבור לשרת');
    }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">ברוכים הבאים, {user.name}</h2>
        <p className="text-gray-600">חשבון: {user.customerNumber}</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedCategory(null);
          }}
          placeholder="חיפוש מוצרים..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Cart Button */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          🛒 עגלת קניות
          {cart.length > 0 && (
            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(categoryId) => {
              setSelectedCategory(categoryId);
              setSearchTerm('');
            }}
          />
        </div>

        {/* Products & Cart */}
        <div className="lg:col-span-3">
          {showCart ? (
            <ShoppingCart
              cartItems={cart}
              onRemove={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onSubmit={handleOrderSubmit}
              customerInfo={user}
            />
          ) : (
            <ProductGrid
              products={products}
              loading={loading}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </div>
    </div>
  );
}