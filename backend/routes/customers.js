import express from 'express';
import { allAsync, getAsync } from '../database-pg.js';

const router = express.Router();

// Login - Get customer by customer number (חשבון)
router.post('/login', async (req, res) => {
  try {
    const { customerNumber } = req.body;

    if (!customerNumber) {
      return res.status(400).json({ error: 'Customer number is required' });
    }

    const customer = await getAsync(
      'SELECT * FROM customers WHERE customer_number = ?',
      [customerNumber]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      success: true,
      customer: {
        id: customer.id,
        customerNumber: customer.customer_number,
        name: customer.customer_name,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zip_code,
        phone1: customer.phone_1,
        phone2: customer.phone_2,
        phone3: customer.phone_3
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get customer profile
router.get('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    const customer = await getAsync(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      id: customer.id,
      customerNumber: customer.customer_number,
      name: customer.customer_name,
      address: customer.address,
      city: customer.city,
      zipCode: customer.zip_code,
      phone1: customer.phone_1,
      phone2: customer.phone_2,
      phone3: customer.phone_3,
      createdAt: customer.created_at
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Get all customers (for admin)
router.get('/', async (req, res) => {
  try {
    const customers = await allAsync('SELECT * FROM customers ORDER BY created_at DESC');
    
    res.json({
      success: true,
      count: customers.length,
      customers: customers.map(c => ({
        id: c.id,
        customerNumber: c.customer_number,
        name: c.customer_name,
        address: c.address,
        city: c.city,
        phone1: c.phone_1,
        createdAt: c.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Update customer profile
router.put('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { address, city, zipCode, phone1, phone2, phone3 } = req.body;

    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE customers SET 
          address = ?, city = ?, zip_code = ?, 
          phone_1 = ?, phone_2 = ?, phone_3 = ?, 
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [address, city, zipCode, phone1, phone2, phone3, customerId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    const customer = await getAsync(
      'SELECT * FROM customers WHERE id = ?',
      [customerId]
    );

    res.json({
      success: true,
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

export default router;
