# ✅ PostgreSQL Setup - What You Need To Do

## Summary
Your app is now configured for **PostgreSQL** instead of SQLite. Your data will auto-load from:
- `backend/users.json` (160+ customers) 
- `backend/categorized_products.json` (products)

---

## 🎯 QUICK START (3 Steps)

### **Step 1: Download PostgreSQL**
- **Windows**: https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql@15`
- **Linux**: `sudo apt-get install postgresql`

### **Step 2: Create Local Database**
```bash
# On Windows/Mac/Linux terminal:
psql -U postgres

# In the psql prompt, type:
CREATE DATABASE alfie;
\q
```

That's it! Your `.env` is already configured for localhost.

### **Step 3: Test Locally**
```bash
cd backend
npm start
```

You should see:
```
✅ Connected to PostgreSQL
📥 Loading data from JSON files...
✅ Loaded 160 customers
✅ Loaded products from 8 categories
```

---

## 🚀 FOR VERCEL DEPLOYMENT

### **You Need To:**

1. **Get a PostgreSQL Database URL** (Choose one):
   - **Railway.app** (Easiest, recommended)
   - **Render.com**
   - **Heroku**
   - Any other PostgreSQL provider

2. **Add to Vercel Environment Variables:**
   - Go to: https://vercel.com/alfi-ecommerce-w4u3/settings/environment-variables
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://user:password@host:port/database`
   - Click "Save"

3. **Redeploy:**
   ```bash
   git push
   # Or manually redeploy from Vercel dashboard
   ```

---

## 📋 Configuration Files Created

✅ `backend/database-pg.js` — PostgreSQL driver
✅ `backend/database.js` — REMOVED (using PostgreSQL now)
✅ `.env.example` — Template for setup
✅ `SETUP_POSTGRESQL.md` — Detailed guide
✅ Updated all routes to use PostgreSQL

---

## 🔧 Environment Variables Explained

### Local Development (.env):
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=alfie
```

### Production (Vercel):
```
DATABASE_URL=postgresql://user:password@host:port/database
```

The app automatically detects which to use based on `NODE_ENV`.

---

## ✨ What Happens On Startup

1. Connects to PostgreSQL ✅
2. Creates tables (customers, categories, products, orders) ✅
3. Checks if data exists
4. If empty, loads from JSON files:
   - All 160+ customers
   - All product categories
   - All products with prices
5. API is ready to use ✅

---

## 🧪 Test Your Setup

### Locally:
```bash
# Terminal 1 - Start backend
cd backend && npm start

# Terminal 2 - Test API
curl http://localhost:5000/api/customers
# Should return all customers
```

### On Vercel:
```bash
curl https://alfi-ecommerce-w4u3.vercel.app/api/customers
curl https://alfi-ecommerce-w4u3.vercel.app/api/products
```

---

## 📱 Test Login

Login with any customer number from your data:
- **2001** - סג"מ
- **2002** - אמית
- **2003** - ג. יהל
- ... (any from your users.json)

---

## ❓ Need Help?

**"How do I get DATABASE_URL?"**
- Railway.app: Connect → PostgreSQL → copy URL
- Render.com: Click on database → External PostgreSQL URL
- Heroku: Settings → Config Vars → check DATABASE_URL

**"Database URL format?"**
```
postgresql://username:password@host.com:5432/databasename
```

**"Tests still failing?"**
- Make sure PostgreSQL is running
- Check `.env` variables are correct
- Look at server logs: `npm start`

---

## 🎉 You're Done!

Once you complete these 3 steps:
1. ✅ Install PostgreSQL
2. ✅ Create database locally (or get cloud URL)
3. ✅ Deploy to Vercel (set DATABASE_URL env var)

Your app will work with your real customer and product data!

---

## Questions to Answer Before Next Steps

1. **Will you use PostgreSQL locally?** (Yes = PostgreSQL, No = cloud only)
2. **Which cloud provider?** (Railway / Render / Heroku / Other)
3. **Do you have the connection string?** (Get from provider)

Let me know when you've completed these and I can help verify!
