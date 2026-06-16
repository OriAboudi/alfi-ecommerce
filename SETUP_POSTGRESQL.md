# PostgreSQL Setup Guide for Alfi E-Commerce

Your app now uses PostgreSQL with automatic data loading from your JSON files (users.json and categorized_products.json).

## What's Changed?

✅ **Replaced SQLite with PostgreSQL** — Data persists on Vercel  
✅ **Automatic Data Loading** — Your customers and products load from JSON files  
✅ **CORS Fixed** — API now works cross-origin  

---

## Step 1: Choose Your Database Option

### Option A: Local Development with PostgreSQL (Recommended)

**1. Install PostgreSQL:**
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql`
- **Linux**: `sudo apt-get install postgresql`

**2. Create Database:**
```bash
# Start PostgreSQL service, then:
psql -U postgres

# In the psql prompt:
CREATE DATABASE alfie;
\q
```

**3. Configure `.env`:**
```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=alfie
```

**4. Test Locally:**
```bash
cd backend
npm start
# Server should connect and load your data automatically
```

---

### Option B: Cloud PostgreSQL (For Vercel)

Choose one of these free services:

#### **Railway.app** (Easiest)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "+ New Project" → Add PostgreSQL
4. Copy the connection string (Database → Connect → URL)
5. Paste into `DATABASE_URL` environment variable

#### **Render.com**
1. Go to https://render.com
2. Sign up with GitHub
3. Create New → PostgreSQL
4. Copy connection string after creation
5. Use in `DATABASE_URL`

#### **Heroku** (Free tier ending, but still available)
1. Go to https://heroku.com
2. Create app → Add PostgreSQL addon
3. Get credentials from Settings
4. Build connection string: `postgresql://user:password@host:port/dbname`

---

## Step 2: Deploy to Vercel

### For Vercel Environment Variables:

1. Go to your Vercel project settings
2. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string

Example:
```
postgresql://user:password@host.com:5432/alfie
```

3. Redeploy

**The app will:**
- Connect to PostgreSQL
- Create tables automatically
- Load all your customers from `users.json` (160+ customers)
- Load all your products from `categorized_products.json`

---

## Step 3: Verify Setup

**Check if data loaded:**
```bash
curl https://alfi-ecommerce-w4u3.vercel.app/api/customers
# Should return your 160+ customers

curl https://alfi-ecommerce-w4u3.vercel.app/api/categories
# Should return your product categories

curl https://alfi-ecommerce-w4u3.vercel.app/api/products
# Should return all your products
```

**Test login** with any customer number from your users.json:
- Use customer #2001 (סג"מ)
- Use customer #2002 (אמית)
- Any customer in your JSON file

---

## Troubleshooting

### "Connection refused" locally
- Make sure PostgreSQL is running: `pg_isrunning` or `brew services list`
- Check `.env` has correct DB_HOST, DB_PORT, DB_USER, DB_PASSWORD

### "DATABASE_URL not set" on Vercel
- Go to Vercel Project Settings → Environment Variables
- Add `DATABASE_URL=postgresql://...`
- Redeploy with `git push`

### Data not loading
- Check that `users.json` and `categorized_products.json` exist in `/backend`
- Check server logs for errors
- Manually run seed: (upcoming admin endpoint)

### Tables already exist but empty
- Edit database-pg.js line 70: Change `ON CONFLICT ... DO NOTHING` to delete and retry
- Or manually delete tables and restart server

---

## Files Changed

- ✅ `backend/database-pg.js` — New PostgreSQL driver
- ✅ `backend/server.js` — Updated to use database-pg.js
- ✅ `backend/routes/*.js` — All updated to use PostgreSQL
- ✅ `.env` — Updated with PostgreSQL variables
- ✅ `.env.example` — Template for setup
- ✅ `package.json` — Added `pg` and `dotenv` packages

---

## What Files Are Used?

Your data comes from these two files (already in project):
- `backend/users.json` — 160+ customer records
- `backend/categorized_products.json` — Products by category

These are automatically loaded into PostgreSQL on first startup.

---

## Next Steps

1. **Local Testing**: Set up PostgreSQL locally, test with `npm start`
2. **Get Vercel Ready**: Choose a cloud database provider
3. **Get Connection String**: Copy PostgreSQL URL
4. **Add to Vercel**: Set `DATABASE_URL` environment variable
5. **Redeploy**: Push changes, watch deploy complete
6. **Test Live**: Try login with your customer numbers

---

## Questions?

Check logs:
```bash
# Local
npm start

# Vercel
vercel logs --follow
```
