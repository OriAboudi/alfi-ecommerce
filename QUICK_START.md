# 🚀 ח.ס אלפי - התחלה מהירה

## ✅ מה קיבלת?

### Backend (Node.js + Express + SQLite)
- ✅ שרת API מלא עם כל endpoints
- ✅ ניהול לקוחות, קטגוריות, מוצרים, הזמנות
- ✅ Admin panel API
- ✅ Database עם דוגמאות נתונים

### Frontend (React + Tailwind + Vite)
- ✅ דף התחברות
- ✅ ממשק לקוח (צפייה מוצרים, עגלה, הזמנה)
- ✅ ממשק Admin (ניהול הכל)
- ✅ עיצוב RTL (עברית)

---

## 🎯 צעדים להתחלה

### 1️⃣ Backend (בטרמינל 1)
```bash
cd backend (או בתיקייה שם backend קיים)

npm install

node scripts/seedDatabase.js

npm start
```
**Result:** Server ב-http://localhost:5000

### 2️⃣ Frontend (בטרמינל 2)
```bash
cd frontend

npm install

npm run dev
```
**Result:** App ב-http://localhost:3000

### 3️⃣ תרגול!
```
כניסה לאתר:
- מספר חשבון: 2001
- או לחץ: "כניסה כמנהל"
```

---

## 📝 מה זה עובד?

### לקוח:
1. ✅ התחברות לפי מספר חשבון
2. ✅ ראה קטגוריות ומוצרים
3. ✅ חיפוש מוצרים
4. ✅ הוסף לעגלה
5. ✅ שלח הזמנה עם תאריך וזמן

### Admin:
1. ✅ ראה סטטיסטיקות
2. ✅ הוסף/מחק לקוחות
3. ✅ הוסף/מחק קטגוריות
4. ✅ הוסף/מחק מוצרים
5. ✅ אשר הזמנות
6. ✅ ראה סיכום הזמנות

---

## 🔑 חשבונות דוגמה

| מספר | שם | סטטוס |
|------|-----|---------|
| 2001 | סג"מ | ✅ Active |
| 2002 | אמית | ✅ Active |
| 2003 | ג. יהל | ✅ Active |
| 2004 | ג'וב אינפו | ✅ Active |
| 2005 | סופר דיל | ✅ Active |

---

## 📂 קבצים חשובים

```
📦 backend/
  📄 server.js           ← שרת
  📄 database.js         ← מסד נתונים
  📁 routes/             ← API
  📁 scripts/            ← טוען נתונים

📦 frontend/
  📁 src/
    📁 pages/            ← דפים
    📁 components/       ← רכיבים
  📄 vite.config.js

📄 README.md            ← מדריך מלא
📄 SETUP_GUIDE.md       ← הגדרה מלאה
```

---

## 🆘 בעיות נפוצות

### "Cannot GET /api/..."
✅ בדוק ש-Backend רץ (`npm start` בterminal 1)

### "connection refused"
✅ בדוק שהports פנויים:
```bash
lsof -i :5000
lsof -i :3000
```

### "No customers found"
✅ הפעל את הseed script:
```bash
node scripts/seedDatabase.js
```

---

## 🎨 התאמה נתונים שלך

### להוסיף לקוחות:
```javascript
// backend/scripts/seedDatabase.js
sampleData.customers.push({
  customerNumber: '2100',
  customerName: 'חברתך'
})
```

### להוסיף מוצרים:
```javascript
// backend/scripts/seedDatabase.js
sampleData.products.push({
  itemId: '5001',
  name: 'מוצר חדש',
  price: 29.90,
  categoryName: 'שם קטגוריה'
})
```

ואז:
```bash
node scripts/seedDatabase.js
```

---

## 📡 API Endpoints (בדיקה מהירה)

```bash
# בדוק שהשרת עובד
curl http://localhost:5000/api/health

# קבל כל מוצרים
curl http://localhost:5000/api/products

# התחבר
curl -X POST http://localhost:5000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{"customerNumber":"2001"}'
```

---

## 🌟 Next Steps

### קטע 1 - הוסף נתונים שלך
1. ערוך `backend/scripts/seedDatabase.js`
2. הוסף לקוחות, קטגוריות, מוצרים שלך
3. הפעל: `node scripts/seedDatabase.js`

### קטע 2 - התאם עיצוב
1. השנה צבעים ב-`frontend/tailwind.config.js`
2. עדכן לוגו ב-`LoginPage.jsx`

### קטע 3 - הוסף עוד תכונות
1. Payment gateway
2. Email notifications
3. Authentication למנהל
4. Mobile app

---

## 💡 טיפים שימושיים

### Dev Mode עם Auto-Reload:
```bash
npm run dev  # בשניהם backend ו-frontend
```

### Inspect Database:
```bash
# צפה בנתונים שנשמרו
sqlite3 data/alfie.db "SELECT * FROM customers;"
```

### Clear Database:
```bash
rm data/alfie.db
node scripts/seedDatabase.js
```

---

## 🎉 יש לך!

- ✅ Backend שלם וחשמל
- ✅ Frontend יפה ותוך מעדנים
- ✅ Database עם דוגמאות
- ✅ מערכת הזמנות עובדת

**עכשיו:**
1. הפעל את שני השרתים
2. לחץ על http://localhost:3000
3. התחבר עם חשבון דוגמה
4. תרגל את המערכת
5. הוסף את הנתונים שלך

---

## 📞 צרכים עזרה?

קרא:
- [`README.md`](./README.md) - מדריך מלא
- [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) - הגדרה מפורטת

**Good Luck! 🚀**

---

*Version 1.0.0 | Built with ❤️ for ח.ס אלפי*
