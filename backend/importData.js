import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'alfie.db');

// Get file paths from command line
const customersFile = process.argv[2];
const productsFile = process.argv[3];

if (!customersFile || !productsFile) {
  console.error('❌ Usage: node importData.js <customers.json> <products.json>');
  console.error('Example: node importData.js users.json categorized_products.json');
  process.exit(1);
}

if (!fs.existsSync(customersFile)) {
  console.error(`❌ File not found: ${customersFile}`);
  process.exit(1);
}

if (!fs.existsSync(productsFile)) {
  console.error(`❌ File not found: ${productsFile}`);
  process.exit(1);
}

console.log('📖 Reading JSON files...');
const customers = JSON.parse(fs.readFileSync(customersFile, 'utf8'));
const productsData = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

const db = new sqlite3.Database(DB_PATH);

function cleanPhone(phone) {
  if (!phone) return null;
  const str = String(phone).trim();
  if (str === '09-' || str === '03-' || str === '04-' || str === '050-' || str === '052-' || str === '054-') return null;
  return str || null;
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
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
          phone_3 TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category_name TEXT UNIQUE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_id TEXT UNIQUE,
          product_name TEXT,
          price REAL,
          category_id INTEGER,
          FOREIGN KEY (category_id) REFERENCES categories(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

async function bulkImport() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          console.error('❌ Transaction error:', err);
          reject(err);
          return;
        }

        // Import Customers
        console.log('\n📥 Importing customers...');
        const customerStmt = db.prepare(
          `INSERT OR IGNORE INTO customers 
           (customer_number, customer_name, address, city, zip_code, phone_1, phone_2, phone_3) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );

        customers.forEach(customer => {
          const cheshbon = customer['חשבון'] || customer.account || customer.id;
          const name = customer['שם חשבון'] || customer.name || '';
          const address = customer['כתובת'] || customer.address || null;
          const city = customer['עיר'] || customer.city || null;
          const zip = customer['מיקוד'] || customer.zip || null;
          const phone1 = cleanPhone(customer['טלפון'] || customer.phone);
          const phone2 = cleanPhone(customer['טלפון 2'] || customer.phone2);
          const phone3 = cleanPhone(customer['טלפון 3'] || customer.phone3);

          customerStmt.run(String(cheshbon), name, address, city, zip, phone1, phone2, phone3);
        });
        customerStmt.finalize();
        console.log(`✅ Imported ${customers.length} customers`);

        // Import Categories & Products
        console.log('\n📥 Importing categories and products...');
        let categoryCount = 0;
        let productCount = 0;

        const categoryStmt = db.prepare(
          'INSERT OR IGNORE INTO categories (category_name) VALUES (?)'
        );
        const productStmt = db.prepare(
          `INSERT OR IGNORE INTO products 
           (item_id, product_name, price, category_id) 
           VALUES (?, ?, ?, (SELECT id FROM categories WHERE category_name = ?))`
        );

        Object.entries(productsData).forEach(([categoryName, products]) => {
          categoryStmt.run(categoryName);
          categoryCount++;

          products.forEach(product => {
            productStmt.run(
              String(product.item_id),
              product.product_name || product.name || '',
              parseFloat(product.price) || 0,
              categoryName
            );
            productCount++;
          });
        });

        categoryStmt.finalize();
        productStmt.finalize();
        console.log(`✅ Imported ${categoryCount} categories`);
        console.log(`✅ Imported ${productCount} products`);

        // Commit
        db.run('COMMIT', (err) => {
          if (err) {
            console.error('❌ Commit error:', err);
            reject(err);
            return;
          }

          console.log('\n========================================');
          console.log('✅ ALL DATA IMPORTED SUCCESSFULLY!');
          console.log('========================================');
          console.log(`📊 Total customers: ${customers.length}`);
          console.log(`📁 Total categories: ${categoryCount}`);
          console.log(`📦 Total products: ${productCount}`);
          console.log('========================================\n');
          
          db.close();
          resolve();
        });
      });
    });
  });
}

initializeDatabase()
  .then(() => bulkImport())
  .catch(err => {
    console.error('❌ Import failed:', err);
    process.exit(1);
  });