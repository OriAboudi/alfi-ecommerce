# ח.ס אלפי - E-Commerce Platform
## מערכת הזמנות אלקטרונית

---

## 🚀 התחלה מהירה

### דרישות מקדימות
- Node.js 16+ 
- npm או yarn
- Git

---

## 📁 מבנה הפרויקט

```
alfi-ecommerce/
├── backend/
│   ├── server.js
│   ├── database.js
│   ├── package.json
│   ├── routes/
│   │   ├── customers.js
│   │   ├── categories.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── scripts/
│   │   └── seedDatabase.js
│   └── data/
│       └── alfie.db (יווצר אוטומטית)
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   ├── config/
    │   │   └── api.js
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── CustomerDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   └── components/
    │       ├── CategoryList.jsx
    │       ├── ProductGrid.jsx
    │       ├── ProductCard.jsx
    │       ├── ShoppingCart.jsx
    │       └── admin/
    │           ├── AdminNav.jsx
    │           ├── Dashboard.jsx
    │           ├── CustomerManagement.jsx
    │           ├── CategoryManagement.jsx
    │           ├── ProductManagement.jsx
    │           └── OrderManagement.jsx
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🔧 התקנה ותצוגה

### 1️⃣ Backend Setup

```bash
# עבור לתיקייה backend
cd backend

# התקן dependencies
npm install

# אתחל את מסד הנתונים
node scripts/seedDatabase.js

# הפעל את השרת
npm start
# או בפיתוח עם auto-restart:
npm run dev
```

השרת יפעל ב: `http://localhost:5000`

**API Endpoints:**
- `GET /api/health` - בדוק סטטוס שרת
- `POST /api/customers/login` - כניסת לקוח
- `GET /api/categories` - קבל קטגוריות
- `GET /api/products` - קבל מוצרים
- `POST /api/orders` - יצור הזמנה
- `GET /api/admin/*` - ממשק ניהול

---

### 2️⃣ Frontend Setup

```bash
# עבור לתיקייה frontend
cd frontend

# התקן dependencies
npm install

# הפעל את dev server
npm run dev
# או בנה ל-production:
npm run build
```

הפרונטאנד יפעל ב: `http://localhost:3000`

---

## 📊 מפת API

### לקוחות (Customers)
```
POST /api/customers/login
- Body: { customerNumber: "2001" }
- Response: { customer: {...} }

GET /api/customers
- Response: { customers: [...] }

GET /api/customers/:customerId
- Response: { customer: {...} }

PUT /api/customers/:customerId
- Update customer profile

DELETE /api/customers/:customerId
- Delete customer
```

### קטגוריות (Categories)
```
GET /api/categories
- Get all categories

GET /api/categories/:categoryId
- Get category with products

POST /api/admin/categories
- Admin: Create category

DELETE /api/admin/categories/:categoryId
- Admin: Delete category
```

### מוצרים (Products)
```
GET /api/products
- Get all products
- Query: ?categoryId=1 or search in name

GET /api/products/search/:query
- Fuzzy search products

POST /api/admin/products
- Admin: Create product

DELETE /api/admin/products/:productId
- Admin: Delete product
```

### הזמנות (Orders)
```
POST /api/orders
- Create new order
- Body: { 
    customerId, 
    items: [...], 
    deliveryDate, 
    deliveryTime, 
    notes 
  }

GET /api/orders/customer/:customerId
- Get customer's orders

GET /api/orders/:orderId/details
- Get order with items

POST /api/orders/:orderId/confirm
- Admin: Confirm order

DELETE /api/orders/:orderId
- Delete order
```

### ניהול (Admin)
```
GET /api/admin/dashboard/stats
- Get dashboard statistics

GET /api/admin/orders/summary/by-date
- Get orders summary by delivery date

GET /api/admin/orders/by-customer
- Get orders grouped by customer
```

---

## 🔐 כניסה ודוגמאות

### דוגמאות חשבונות לקוח (כבר בDB):
| מספר חשבון | שם |
|-----------|-----|
| 2001 | סג"מ |
| 2002 | אמית |
| 2003 | ג. יהל |
| 2004 | ג'וב אינפו |
| 2005 | סופר דיל |

### כניסת מנהל:
לחץ על "כניסה כמנהל" בעמוד ההתחברות
(בעתיד: הוסף אימות סיסמה)

---

## 💾 מבנה Database

### טבלאות:
1. **customers** - מידע לקוחות
2. **categories** - קטגוריות מוצרים
3. **products** - מוצרים וחיר
4. **orders** - הזמנות
5. **order_items** - פרטי פריטים בהזמנה

---

## 🎯 תכונות עיקריות

### לקוח:
✅ כניסה לפי מספר חשבון
✅ צפייה בקטגוריות ומוצרים
✅ חיפוש מוצרים
✅ הוספת מוצרים לעגלה
✅ עדכון כמויות
✅ יצירת הזמנה עם תאריך וזמן הספקה
✅ הערות הזמנה

### מנהל:
✅ ניהול לקוחות (הוסף/מחק)
✅ ניהול קטגוריות (הוסף/מחק)
✅ ניהול מוצרים (הוסף/מחק)
✅ צפייה בהזמנות
✅ אישור הזמנות
✅ סיכום הזמנות לפי תאריך
✅ דוח סטטיסטיקות

---

## 🐛 פתרון בעיות

### Backend לא מתחבר:
```bash
# בדוק את ה-port
lsof -i :5000

# או שנה את ה-port בserver.js
const PORT = process.env.PORT || 3001
```

### Frontend לא רואה Backend:
```bash
# בדוק ש-Backend רץ ב-5000
# ודא את API_URL בـ frontend/src/config/api.js
export const API_URL = 'http://localhost:5000/api';
```

### Database לא נטען:
```bash
# מחק את alfie.db וצור מחדש:
rm data/alfie.db
node scripts/seedDatabase.js
```

---

## 📝 עדכון הנתונים שלך

### להוסיף לקוחות משלך:
1. שנה את `scripts/seedDatabase.js` - הוסף לקוחות בSection `sampleData.customers`
2. או השתמש בממשק Admin -> לקוחות

### להוסיף מוצרים משלך:
1. עדכן את `scripts/seedDatabase.js` - הוסף מוצרים בSection `sampleData.products`
2. ודא שהקטגוריה קיימת
3. או השתמש בממשק Admin -> מוצרים

### להוסיף קטגוריות:
```javascript
// בـ seedDatabase.js
sampleData.categories.push({ name: 'שם הקטגוריה' })
```

---

## 🚀 Deployment

### Backend (כמו Heroku):
```bash
# ודא package.json של backend
npm install
npm start
```

### Frontend (כמו Vercel/Netlify):
```bash
# בנה את הפרונטאנד
npm run build

# עלה את התיקייה dist
# וודא API_URL מוגדר כמו:
REACT_APP_API_URL=https://your-backend.com/api
```

---

## 📞 תמיכה וייעוץ

לכל שאלה או בעיה, בדוק:
1. את Console בדפדפן (F12)
2. את לוגים בטרמינל של Backend
3. את מבנה הנתונים בDatabase

---

## 📄 הערות חשובות

- מסד הנתונים משתמש ב-SQLite (קובץ אחד)
- בעתיד, שקול עברה ל-PostgreSQL/MySQL לפרודקשן
- הוסף אימות סיסמה למנהל
- הוסף JWT tokens לביטחון API
- קבע rate limiting על ה-API

---

**תבנית יצירה: 2024**
**דירוג: בעתיד - ייעוץ לפיתוח המשך**
