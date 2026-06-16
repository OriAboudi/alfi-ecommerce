import express from 'express';
import { allAsync, getAsync, runAsync } from '../database-pg.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { categoryId, search } = req.query;

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
    `;
    let params = [];

    if (categoryId) {
      query += ' WHERE p.category_id = $1';
      params.push(categoryId);
    }

    query += ' ORDER BY p.name ASC';

    let products = await allAsync(query, params);

    // Search filtering
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.item_id.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p.id,
        itemId: p.item_id,
        name: p.name,
        price: parseFloat(p.price),
        description: p.description,
        categoryId: p.category_id,
        categoryName: p.category_name,
        inStock: p.in_stock
      }))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const products = await allAsync(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.name ILIKE $1 OR p.item_id ILIKE $2
      ORDER BY p.name ASC
    `, [`%${query}%`, `%${query}%`]);

    res.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        id: p.id,
        itemId: p.item_id,
        name: p.name,
        price: parseFloat(p.price),
        description: p.description,
        categoryId: p.category_id,
        categoryName: p.category_name,
        inStock: p.in_stock
      }))
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get single product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await getAsync(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [productId]);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      id: product.id,
      itemId: product.item_id,
      name: product.name,
      price: parseFloat(product.price),
      description: product.description,
      categoryId: product.category_id,
      categoryName: product.name,
      inStock: product.in_stock
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin)
router.post('/', async (req, res) => {
  try {
    const { itemId, name, price, categoryId, description } = req.body;

    if (!itemId || !name || !price || !categoryId) {
      return res.status(400).json({
        error: 'itemId, name, price, and categoryId are required'
      });
    }

    const result = await runAsync(
      `INSERT INTO products
       (item_id, name, price, category_id, description, in_stock)
       VALUES ($1, $2, $3, $4, $5, 1)
       RETURNING id`,
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
    if (error.message.includes('duplicate key')) {
      return res.status(400).json({ error: 'Item ID already exists' });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin)
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, description, inStock } = req.body;

    await runAsync(
      `UPDATE products
       SET name = $1, price = $2, description = $3, in_stock = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [name, price, description, inStock, productId]
    );

    const product = await getAsync(
      'SELECT * FROM products WHERE id = $1',
      [productId]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin)
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    await runAsync(
      'DELETE FROM products WHERE id = $1',
      [productId]
    );

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
