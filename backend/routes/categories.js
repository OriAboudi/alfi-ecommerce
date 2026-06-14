import express from 'express';
import { allAsync, getAsync, runAsync } from '../database.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await allAsync(
      'SELECT * FROM categories ORDER BY category_name ASC'
    );

    res.json({
      success: true,
      count: categories.length,
      categories: categories.map(c => ({
        id: c.id,
        name: c.category_name,
        description: c.description,
        createdAt: c.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category with products
router.get('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await getAsync(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const products = await allAsync(
      'SELECT * FROM products WHERE category_id = ? ORDER BY product_name ASC',
      [categoryId]
    );

    res.json({
      id: category.id,
      name: category.category_name,
      description: category.description,
      products: products.map(p => ({
        id: p.id,
        itemId: p.item_id,
        name: p.product_name,
        price: p.price,
        description: p.description,
        inStock: p.in_stock
      }))
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create category (admin)
router.post('/', async (req, res) => {
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

// Update category (admin)
router.put('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE categories SET category_name = ?, description = ? WHERE id = ?',
        [name, description, categoryId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const category = await getAsync(
      'SELECT * FROM categories WHERE id = ?',
      [categoryId]
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (admin)
router.delete('/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;

    await new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM categories WHERE id = ?',
        [categoryId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
