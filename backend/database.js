import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// For Vercel: use /tmp directory (writable)
// For local: use ./data directory
const isDevelopment = process.env.NODE_ENV !== 'production';

let DB_PATH;

if (isDevelopment) {
  // Local development: use ./data folder
  const DATA_DIR = path.join(__dirname, 'data');
  DB_PATH = path.join(DATA_DIR, 'alfie.db');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`📁 Created data directory: ${DATA_DIR}`);
  }
} else {
  // Production (Vercel): use /tmp directory (always writable)
  DB_PATH = '/tmp/alfie.db';
  console.log(`📁 Using Vercel temp directory: ${DB_PATH}`);
}

let db;

export const getDB = () => {
  return db;
};

export const initDatabase = async () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
        reject(err);
        return;
      }

      console.log(`✅ Database connected: ${DB_PATH}`);

      // Create tables if they don't exist
      createTables();
      resolve();
    });
  });
};

function createTables() {
  db.serialize(() => {
    // Customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_number TEXT UNIQUE,
        customer_name TEXT,
        address TEXT,
        city TEXT,
        zip_code TEXT,
        phone_1 TEXT,
        phone_2 TEXT,
        phone_3 TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating customers table:', err);
      else seedCustomers();
    });

    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating categories table:', err);
      else seedCategories();
    });

    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        item_id TEXT UNIQUE,
        name TEXT,
        price DECIMAL(10,2),
        description TEXT,
        in_stock INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(category_id) REFERENCES categories(id)
      )
    `, (err) => {
      if (err) console.error('Error creating products table:', err);
      else seedProducts();
    });

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE,
        customer_id INTEGER,
        customer_number TEXT,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        notes TEXT,
        delivery_date DATE,
        delivery_time TIME,
        confirmed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(customer_id) REFERENCES customers(id)
      )
    `, (err) => {
      if (err) console.error('Error creating orders table:', err);
    });

    // Order items table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        item_id TEXT,
        product_name TEXT,
        quantity INTEGER,
        price DECIMAL(10,2),
        subtotal DECIMAL(10,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES orders(id),
        FOREIGN KEY(product_id) REFERENCES products(id)
      )
    `, (err) => {
      if (err) console.error('Error creating order_items table:', err);
    });

    console.log('✅ All tables created/verified');
  });
}

function seedCustomers() {
  db.get('SELECT COUNT(*) as count FROM customers', (err, row) => {
    if (err) return;
    if (row.count === 0) {
      const customers = [
        { customer_number: '1001', customer_name: 'תאיר ע.מ', address: 'רחוב התקווה 10', city: 'תל אביב', phone_1: '03-1234567' },
        { customer_number: '1002', customer_name: 'קלאים בע"מ', address: 'שדרות רוטשילד 50', city: 'תל אביב', phone_1: '03-9876543' },
        { customer_number: '1003', customer_name: 'ג\'.כ. משרדים', address: 'רח׳ דיזנגוף 20', city: 'תל אביב', phone_1: '03-5555555' },
        { customer_number: '1004', customer_name: 'מזכירויות אלופות', address: 'בן יהודה 35', city: 'תל אביב', phone_1: '03-4444444' },
      ];

      customers.forEach(c => {
        db.run(
          'INSERT INTO customers (customer_number, customer_name, address, city, phone_1) VALUES (?, ?, ?, ?, ?)',
          [c.customer_number, c.customer_name, c.address, c.city, c.phone_1],
          (err) => {
            if (!err) console.log(`✅ Added customer: ${c.customer_number}`);
          }
        );
      });
    }
  });
}

function seedCategories() {
  db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
    if (err) return;
    if (row.count === 0) {
      const categories = [
        { name: 'צהריים קלים' },
        { name: 'סלטים' },
        { name: 'סנדוויצ\'ים' },
        { name: 'קינוחים' },
        { name: 'משקאות' },
      ];

      categories.forEach(c => {
        db.run('INSERT INTO categories (name) VALUES (?)', [c.name]);
      });
    }
  });
}

function seedProducts() {
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (err) return;
    if (row.count === 0) {
      db.get('SELECT id FROM categories LIMIT 1', (err, cat) => {
        if (err || !cat) return;

        const products = [
          { item_id: 'P001', name: 'סלט ירוק', price: 25, category_id: cat.id },
          { item_id: 'P002', name: 'סלט עגבניות', price: 28, category_id: cat.id },
          { item_id: 'P003', name: 'סנדוויץ\' עוף', price: 35, category_id: cat.id },
          { item_id: 'P004', name: 'עוגיות שוקולד', price: 15, category_id: cat.id },
          { item_id: 'P005', name: 'קפה', price: 8, category_id: cat.id },
        ];

        products.forEach(p => {
          db.run(
            'INSERT INTO products (item_id, name, price, category_id) VALUES (?, ?, ?, ?)',
            [p.item_id, p.name, p.price, p.category_id]
          );
        });
      });
    }
  });
}

// Helper functions for database operations
export const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        resolve({
          id: this.lastID || null,
          changes: this.changes || 0
        });
      }
    });
  });
};

export const getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};