import express from 'express';
import { allAsync, getAsync, runAsync } from '../database.js';

const router = express.Router();

// ============ CUSTOMER MANAGEMENT ============

// Add new customer
router.post('/customers', async (req, res) => {
  try {
    const { customerNumber, customerName, address, city, zipCode, phone1, phone2, phone3 } = req.body;

    if (!customerNumber || !customerName) {
      return res.status(400).json({ 
        error: 'Customer number and name are required' 
      });
    }

    const result = await runAsync(
      `INSERT INTO customers 
       (customer_number, customer_name, address, city, zip_code, phone_1, phone_2, phone_3) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [customerNumber, customerName, address || null, city || null, zipCode || null, 
       phone1 || null, phone2 || null, phone3 || null]
    );

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      customer: {
        id: result.id,
        customerNumber,
        customerName,
        address,
        city,
        zipCode,
        phone1,
        phone2,
        phone3
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Customer number already exists' });
    }
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// Delete customer
router.delete('/customers/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    await runAsync('DELETE FROM customers WHERE id = ?', [customerId]);

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// ============ CATEGORY MANAGEMENT ============

// Get all categories (for admin)
router.get('/categories', async (req, res) => {
  try {
    const categories = await allAsync(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id 
      GROUP BY c.id 
      ORDER BY c.category_name ASC
    `);

    res.json({
      success: true,
      count: categories.length,
      categories: categories.map(c => ({
        id: c.id,
        name: c.category_name,
        description: c.description,
        productCount: c.product_count,
        createdAt: c.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category
router.post('/categories', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = await runAsync(
      'INSERT INTO categories (category_name, description) VALUES (?, ?)',
      [name, description || '']
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: {
        id: result.id,
        name,
        description: description || ''
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Delete category
router.delete('/categories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    await runAsync('DELETE FROM categories WHERE id = ?', [categoryId]);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============ PRODUCT MANAGEMENT ============

// Get all products (for admin)
router.get('/products', async (req, res) => {
  try {
    const products = await allAsync(`
      SELECT p.*, c.category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      ORDER BY p.product_name ASC
    `);

    res.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p.id,
        itemId: p.item_id,
        name: p.product_name,
        price: parseFloat(p.price),
        categoryId: p.category_id,
        categoryName: p.category_name,
        description: p.description,
        inStock: p.in_stock,
        createdAt: p.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const { itemId, name, price, categoryId, description } = req.body;

    if (!itemId || !name || !price || !categoryId) {
      return res.status(400).json({ 
        error: 'itemId, name, price, and categoryId are required' 
      });
    }

    const result = await runAsync(
      `INSERT INTO products 
       (item_id, product_name, price, category_id, description, in_stock) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [itemId, name, parseFloat(price), categoryId, description || '']
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: result.id,
        itemId,
        name,
        price,
        categoryId,
        description
      }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Item ID already exists' });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Delete product
router.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    await runAsync('DELETE FROM products WHERE id = ?', [productId]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============ ORDER MANAGEMENT ============

// Get order summary by delivery date
router.get('/orders/summary/by-date', async (req, res) => {
  try {
    const summary = await allAsync(`
      SELECT 
        delivery_date,
        delivery_time,
        COUNT(*) as order_count,
        SUM(total_amount) as total_amount,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_count
      FROM orders
      WHERE delivery_date IS NOT NULL
      GROUP BY delivery_date, delivery_time
      ORDER BY delivery_date ASC, delivery_time ASC
    `);

    res.json({
      success: true,
      summary: summary.map(s => ({
        deliveryDate: s.delivery_date,
        deliveryTime: s.delivery_time,
        orderCount: s.order_count,
        totalAmount: parseFloat(s.total_amount),
        confirmedCount: s.confirmed_count
      }))
    });
  } catch (error) {
    console.error('Error fetching order summary:', error);
    res.status(500).json({ error: 'Failed to fetch order summary' });
  }
});

// Get all orders by customer
router.get('/orders/by-customer', async (req, res) => {
  try {
    const orders = await allAsync(`
      SELECT 
        c.id as customer_id,
        c.customer_number,
        c.customer_name,
        COUNT(o.id) as order_count,
        SUM(o.total_amount) as total_spent,
        MAX(o.created_at) as last_order_date
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id
      GROUP BY c.id
      ORDER BY total_spent DESC
    `);

    res.json({
      success: true,
      customers: orders.map(o => ({
        customerId: o.customer_id,
        customerNumber: o.customer_number,
        customerName: o.customer_name,
        orderCount: o.order_count || 0,
        totalSpent: o.total_spent ? parseFloat(o.total_spent) : 0,
        lastOrderDate: o.last_order_date
      }))
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const customerCount = await getAsync('SELECT COUNT(*) as count FROM customers');
    const productCount = await getAsync('SELECT COUNT(*) as count FROM products');
    const categoryCount = await getAsync('SELECT COUNT(*) as count FROM categories');
    const orderCount = await getAsync('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await getAsync('SELECT SUM(total_amount) as sum FROM orders WHERE status = "confirmed"');

    res.json({
      success: true,
      stats: {
        customers: customerCount.count,
        products: productCount.count,
        categories: categoryCount.count,
        totalOrders: orderCount.count,
        totalRevenue: totalRevenue.sum ? parseFloat(totalRevenue.sum) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;