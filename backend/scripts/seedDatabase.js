import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'alfie.db');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

// CREATE TABLES FIRST
function createTables() {
  return new Promise((resolve) => {
    db.serialize(() => {
      // Customers table
      db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_number TEXT UNIQUE NOT NULL,
          customer_name TEXT NOT NULL,
          address TEXT,
          city TEXT,
          zip_code TEXT,
          phone_1 TEXT,
          phone_2 TEXT,
          phone_3 TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Categories table
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_id INTEGER NOT NULL,
          product_name TEXT NOT NULL,
          item_id TEXT UNIQUE NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          description TEXT,
          in_stock INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
      `);

      // Orders table
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_number TEXT UNIQUE NOT NULL,
          customer_id INTEGER NOT NULL,
          customer_number TEXT NOT NULL,
          order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'pending',
          total_amount DECIMAL(10, 2) NOT NULL,
          notes TEXT,
          delivery_date TEXT,
          delivery_time TEXT,
          confirmed_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
      `);

      // Order items table
      db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          item_id TEXT NOT NULL,
          product_name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          subtotal DECIMAL(10, 2) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id)
        )
      `, () => {
        resolve();
      });
    });
  });
}

const sampleData = {
  customers: [
    { customerNumber: '2001', customerName: 'סג"מ', address: 'בזל', city: 'פתח תקוה', phone1: '09-9100900' },
    { customerNumber: '2002', customerName: 'אמית', address: 'המכבים', city: 'תל אביב', phone1: '09-9123183' },
    { customerNumber: '2003', customerName: 'ג. יהל', address: 'דוד הנציב', city: 'ירושלים', phone1: '02-5678901' },
    { customerNumber: '2004', customerName: 'ג\'וב אינפו', address: 'רחוב 1', city: 'רמת גן', phone1: '03-1234567' },
    { customerNumber: '2005', customerName: 'סופר דיל', address: 'רחוב 2', city: 'בני ברק', phone1: '03-9876543' }
  ],
  categories: [
    { name: 'מוצרי חלב (Dairy)' },
    { name: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    { name: 'מיץ ודברים ברים (Beverages)' },
    { name: 'מוצרים מטבח (Kitchen)' },
    { name: 'עוגיות וממתקים (Snacks)' }
  ],
  products: [
    // Dairy
    { itemId: '1001', name: 'חלב עמיד 3% 1 ליטר', price: 5.36, categoryName: 'מוצרי חלב (Dairy)' },
    { itemId: '1002', name: 'חלב עמיד 1% 1 ליטר', price: 5.5, categoryName: 'מוצרי חלב (Dairy)' },
    { itemId: '1003', name: 'חלב הומוגני 3% 1 ליטר', price: 8.04, categoryName: 'מוצרי חלב (Dairy)' },
    { itemId: '1004', name: 'חלב הומוגני 1% 1 ליטר', price: 5.74, categoryName: 'מוצרי חלב (Dairy)' },
    { itemId: '1123', name: 'שוקולד ממרח חלבה', price: 9.9, categoryName: 'מוצרי חלב (Dairy)' },
    { itemId: '1171', name: 'גבינה לבנה 250 גרם', price: 4.8, categoryName: 'מוצרי חלב (Dairy)' },
    { itemId: '1173', name: 'גבינה צהובה', price: 16.9, categoryName: 'מוצרי חלב (Dairy)' },
    
    // Hot Drinks & Sugar
    { itemId: '1007', name: 'סוכר', price: 3.5, categoryName: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    { itemId: '1008', name: 'סוכרזית טבליות 1000 יח', price: 9.9, categoryName: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    { itemId: '1010', name: 'קפה נמס עלית 200 גרם', price: 18.9, categoryName: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    { itemId: '1011', name: 'קפה נמס האג 200 גרם', price: 29.9, categoryName: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    { itemId: '1012', name: 'קפה נמס רד מאג 200 גרם', price: 21.0, categoryName: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    { itemId: '1025', name: 'תה ויסוצקי כחול גדול', price: 15.8, categoryName: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    { itemId: '1028', name: 'תה ליפטון', price: 15.8, categoryName: 'קפה, תה וסוכר (Hot Drinks & Sugar)' },
    
    // Beverages
    { itemId: '1291', name: 'שוקו שקית', price: 1.65, categoryName: 'מיץ ודברים ברים (Beverages)' },
    { itemId: '1358', name: 'חלב ריץ\'', price: 9.9, categoryName: 'מיץ ודברים ברים (Beverages)' },
    
    // Kitchen
    { itemId: '1024', name: 'שוקולית', price: 11.9, categoryName: 'מוצרים מטבח (Kitchen)' },
    
    // Snacks
    { itemId: '1162', name: 'גבינות 50 גרם', price: 1.1, categoryName: 'עוגיות וממתקים (Snacks)' },
    { itemId: '1172', name: 'קוטג\' 250 גרם', price: 4.8, categoryName: 'עוגיות וממתקים (Snacks)' }
  ]
};

async function seedDatabase() {
  // First create tables
  await createTables();

  db.serialize(() => {
    // Insert customers
    const customerStmt = db.prepare(
      'INSERT INTO customers (customer_number, customer_name, address, city, phone_1) VALUES (?, ?, ?, ?, ?)'
    );
    
    sampleData.customers.forEach(customer => {
      customerStmt.run(
        customer.customerNumber,
        customer.customerName,
        customer.address,
        customer.city,
        customer.phone1
      );
    });

    // Insert categories
    const categoryStmt = db.prepare(
      'INSERT INTO categories (category_name) VALUES (?)'
    );
    
    sampleData.categories.forEach(category => {
      categoryStmt.run(category.name);
    });

    // Get category IDs and insert products
    const getCategoryId = db.prepare('SELECT id FROM categories WHERE category_name = ?');
    const productStmt = db.prepare(
      'INSERT INTO products (item_id, product_name, price, category_id) VALUES (?, ?, ?, ?)'
    );

    let productCount = 0;
    sampleData.products.forEach(product => {
      getCategoryId.get([product.categoryName], (err, row) => {
        if (row) {
          productStmt.run(product.itemId, product.name, product.price, row.id);
          productCount++;
        }
      });
    });

    // Finalize after a brief delay to ensure all operations complete
    setTimeout(() => {
      customerStmt.finalize();
      categoryStmt.finalize();
      getCategoryId.finalize();
      productStmt.finalize();

      console.log('✅ Database seeded successfully!');
      console.log(`✅ Added ${sampleData.customers.length} customers`);
      console.log(`✅ Added ${sampleData.categories.length} categories`);
      console.log(`✅ Added ${sampleData.products.length} products`);
      
      db.close();
    }, 500);
  });
}

seedDatabase();