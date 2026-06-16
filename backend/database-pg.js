import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// PostgreSQL connection pool
let pool;

export const getDB = () => pool;

export const initDatabase = async () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const connectionConfig = isDevelopment
    ? {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'alfie',
      }
    : {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      };

  pool = new Pool(connectionConfig);

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL');
    client.release();

    await createTables();
    await seedData();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      customer_number VARCHAR(255) UNIQUE NOT NULL,
      customer_name VARCHAR(255),
      address VARCHAR(255),
      city VARCHAR(255),
      zip_code VARCHAR(20),
      phone_1 VARCHAR(20),
      phone_2 VARCHAR(20),
      phone_3 VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      category_id INTEGER REFERENCES categories(id),
      item_id VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      price DECIMAL(10,2),
      description TEXT,
      in_stock INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number VARCHAR(255) UNIQUE NOT NULL,
      customer_id INTEGER REFERENCES customers(id),
      customer_number VARCHAR(255),
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'pending',
      total_amount DECIMAL(10,2),
      notes TEXT,
      delivery_date DATE,
      delivery_time TIME,
      confirmed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id),
      product_id INTEGER REFERENCES products(id),
      item_id VARCHAR(255),
      product_name VARCHAR(255),
      quantity INTEGER,
      price DECIMAL(10,2),
      subtotal DECIMAL(10,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error('Error creating table:', error);
      }
    }
  }
}

async function seedData() {
  console.log('📥 Checking if data needs to be loaded...');

  // Check if categories exist (more reliable indicator of full seed)
  const catResult = await pool.query('SELECT COUNT(*) as count FROM categories');
  if (catResult.rows[0].count > 0) {
    console.log('✅ Database already has categories and products, skipping seed');
    return;
  }

  console.log('📥 Loading data from JSON files...');

  try {
    // Load and seed customers from users.json
    const usersPath = path.join(__dirname, 'users.json');
    console.log(`📂 Customers file path: ${usersPath}`);

    if (!fs.existsSync(usersPath)) {
      console.error('❌ users.json not found!');
      return;
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    console.log(`📊 Found ${usersData.length} customers in JSON`);

    let customerCount = 0;
    for (const user of usersData) {
      const customerNumber = user.חשבון.toString();
      const customerName = user['שם חשבון'] || '';
      const address = user.כתובת || null;
      const city = user.עיר || null;
      const zipCode = user.מיקוד || null;
      const phone1 = user.טלפון ? user.טלפון.toString().replace(/\.0$/, '') : null;
      const phone2 = user['טלפון 2'] ? user['טלפון 2'].toString().replace(/\.0$/, '') : null;
      const phone3 = user['טלפון 3'] ? user['טלפון 3'].toString().replace(/\.0$/, '') : null;

      try {
        await pool.query(
          `INSERT INTO customers (customer_number, customer_name, address, city, zip_code, phone_1, phone_2, phone_3)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (customer_number) DO NOTHING`,
          [customerNumber, customerName, address, city, zipCode, phone1, phone2, phone3]
        );
        customerCount++;
      } catch (error) {
        console.error(`❌ Error inserting customer ${customerNumber}: ${error.message}`);
      }
    }
    console.log(`✅ Loaded ${customerCount} customers`);

    // Load and seed products from categorized_products.json
    const productsPath = path.join(__dirname, 'categorized_products.json');
    console.log(`📂 Products file path: ${productsPath}`);

    if (!fs.existsSync(productsPath)) {
      console.error('❌ categorized_products.json not found!');
      return;
    }

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    console.log(`📊 Found ${Object.keys(productsData).length} categories in JSON`);

    let totalProducts = 0;
    for (const [categoryName, products] of Object.entries(productsData)) {
      const trimmedCategory = categoryName.trim();
      console.log(`  📦 Loading category: "${trimmedCategory}" (${products.length} products)`);

      try {
        // Insert category
        const catResult = await pool.query(
          'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
          [trimmedCategory]
        );
        const categoryId = catResult.rows[0].id;
        console.log(`    ✅ Category ID: ${categoryId}`);

        // Insert products for this category
        let categoryProductCount = 0;
        for (const product of products) {
          try {
            await pool.query(
              `INSERT INTO products (item_id, name, price, category_id)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (item_id) DO NOTHING`,
              [product.item_id, product.product_name, product.price, categoryId]
            );
            categoryProductCount++;
            totalProducts++;
          } catch (error) {
            console.error(`    ❌ Error inserting product ${product.item_id}: ${error.message}`);
          }
        }
        console.log(`    ✅ Loaded ${categoryProductCount} products`);
      } catch (error) {
        console.error(`❌ Error with category "${trimmedCategory}": ${error.message}`);
      }
    }
    console.log(`✅ Total: Loaded ${totalProducts} products from ${Object.keys(productsData).length} categories`);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
}

// Helper functions
export const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        console.error('Database error:', error);
        reject(error);
      } else {
        resolve({
          id: result.rows[0]?.id || null,
          changes: result.rowCount || 0
        });
      }
    });
  });
};

export const getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows[0] || null);
      }
    });
  });
};

export const allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.rows || []);
      }
    });
  });
};
