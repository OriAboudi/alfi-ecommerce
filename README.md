# ח.ס אלפי - מערכת הזמנות אלקטרונית
## E-Commerce Ordering System

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-16%2B-brightgreen)
![React](https://img.shields.io/badge/react-18-blue)

---

## 📋 תיאור הפרויקט

**ח.ס אלפי** היא מערכת הזמנות אלקטרונית המאפשרת:
- 👥 לקוחות להתחבר ולהזמין מוצרים
- 📦 ניהול קטגוריות ומוצרים
- 📋 ניהול הזמנות בזמן אמת
- 📊 דוחות וסטטיסטיקות

---

## 🛠️ טכנולוגיות

### Backend
- **Node.js + Express** - שרת API
- **SQLite** - מסד נתונים
- **CORS** - ניהול בקשות חוצות דומיין

### Frontend
- **React 18** - ממשק משתמש
- **Tailwind CSS** - עיצוב
- **Vite** - build tool
- **RTL Support** - תמיכה בעברית

---

## 📥 התקנה מהירה

### 1. שכפול הפרויקט
```bash
git clone <repository-url>
cd alfi-ecommerce
```

### 2. Backend Setup
```bash
npm install

# התחל את מסד הנתונים עם דוגמאות
node scripts/seedDatabase.js

# הפעל את השרת
npm start
```

### 3. Frontend Setup (בחלון Terminal אחר)
```bash
cd frontend
npm install

# הפעל את dev server
npm run dev
```

**ביום רובה:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## 👥 דוגמאות כניסה

### חשבונות לקוח זמינים:
| חשבון | שם | טלפון |
|-------|-----|---------|
| 2001 | סג"מ | 09-9100900 |
| 2002 | אמית | 09-9123183 |
| 2003 | ג. יהל | - |
| 2004 | ג'וב אינפו | - |
| 2005 | סופר דיל | - |

### כניסת מנהל:
- לחץ על "כניסה כמנהל"
- (בעתיד: סיסמה)

---

## 🏗️ מבנה Folder

```
├── backend/
│   ├── server.js              ← נקודת כניסה
│   ├── database.js            ← חיבור ל-DB
│   ├── routes/                ← API endpoints
│   ├── scripts/               ← טוענים נתונים
│   └── data/                  ← SQLite file
│
├── frontend/
│   ├── src/
│   │   ├── pages/             ← דפים ראשיים
│   │   ├── components/        ← רכיבים
│   │   └── config/            ← הגדרות
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── SETUP_GUIDE.md            ← מדריך מפורט
```

---

## 📡 API Endpoints

### 🔑 Customers API
```
POST   /api/customers/login              ← כניסה
GET    /api/customers/:id                ← פרופיל
PUT    /api/customers/:id                ← עדכון
DELETE /api/customers/:id                ← מחיקה
```

### 📁 Categories API
```
GET    /api/categories                   ← הכל
GET    /api/categories/:id               ← פרטים
POST   /api/admin/categories             ← יצירה
DELETE /api/admin/categories/:id         ← מחיקה
```

### 📦 Products API
```
GET    /api/products                     ← הכל
GET    /api/products/:id                 ← פרטים
GET    /api/products/search/:query       ← חיפוש
POST   /api/admin/products               ← יצירה
DELETE /api/admin/products/:id           ← מחיקה
```

### 📋 Orders API
```
POST   /api/orders                       ← יצירה
GET    /api/orders                       ← הזמנות (Admin)
GET    /api/orders/customer/:id          ← הזמנות לקוח
GET    /api/orders/:id/details           ← פרטי הזמנה
POST   /api/orders/:id/confirm           ← אישור
DELETE /api/orders/:id                   ← מחיקה
```

### 👨‍💼 Admin API
```
GET    /api/admin/dashboard/stats        ← סטטיסטיקות
GET    /api/admin/orders/summary/by-date ← סיכום לפי תאריך
GET    /api/admin/orders/by-customer     ← סיכום לפי לקוח
```

---

## 💡 תכונות עיקריות

### ✅ Completed
- [x] מערכת כניסה לקוחות
- [x] צפייה בקטגוריות ומוצרים
- [x] חיפוש מוצרים
- [x] עגלת קניות
- [x] יצירת הזמנות
- [x] ניהול הזמנות (Admin)
- [x] ניהול מוצרים (Admin)
- [x] סטטיסטיקות
- [x] RTL Support

### 🔄 Future Features
- [ ] אימות סיסמה למנהל
- [ ] JWT tokens
- [ ] Payment Gateway
- [ ] Email Notifications
- [ ] Mobile App
- [ ] Analytics Dashboard
- [ ] Multi-language Support

---

## 🔒 אבטחה (עתידית)

### בעתיד יש להוסיף:
1. **Authentication**
   - JWT tokens למנהל
   - Secure password hashing

2. **API Security**
   - Rate limiting
   - Input validation
   - CORS proper configuration

3. **Database**
   - Encrypted sensitive data
   - Backup strategy

---

## 🐛 Troubleshooting

### ❌ Backend לא עובד
```bash
# בדוק את הפורט
lsof -i :5000

# הפעל עם verbose logging
DEBUG=* npm start
```

### ❌ Frontend לא מתחבר ל-Backend
```bash
# בדוק את API_URL בקובץ:
# frontend/src/config/api.js

export const API_URL = 'http://localhost:5000/api';
```

### ❌ Database לא נטען
```bash
# מחק ו-recreate
rm data/alfie.db
node scripts/seedDatabase.js
```

---

## 📊 דוגמאות Requests

### Login
```bash
curl -X POST http://localhost:5000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{"customerNumber":"2001"}'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "customerNumber": "2001",
    "items": [
      {"id": 1, "name": "חלב", "price": 5.36, "quantity": 2}
    ],
    "deliveryDate": "2024-01-15",
    "deliveryTime": "10:00"
  }'
```

---

## 📈 Deployment

### Backend (Heroku/Railway)
```bash
npm install
npm start
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# העלה את dist folder
```

### Environment Variables
```env
REACT_APP_API_URL=https://your-api.com/api
```

---

## 👨‍💻 התפתחות

### דרישות
- Node.js 16+
- npm/yarn
- Git

### Dev Mode
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📚 מדריכים נוספים

- [Setup Guide](./SETUP_GUIDE.md) - מדריך התקנה מפורט
- [Database Schema](./docs/database.md) - מבנה המסד
- [API Documentation](./docs/api.md) - תיעוד API

---

## 📞 Contact & Support

לשאלות או בעיות:
1. בדוק את Troubleshooting section
2. עיין בקודים ובלוגים
3. בדוק את Console בדפדפן (F12)

---

## 📄 License

MIT License - ראה LICENSE file

---

## 🙏 תודות

בנוי עם ❤️ עבור ח.ס אלפי

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Active Development ✅

---

## 🗺️ Roadmap

### Phase 1 (✅ Current)
- Basic CRUD operations
- Customer ordering
- Admin management

### Phase 2 (🔜 Next)
- Authentication & Security
- Payment integration
- Email notifications

### Phase 3 (📅 Future)
- Mobile app
- Advanced analytics
- Multi-location support

---

**Happy Coding! 🚀**
