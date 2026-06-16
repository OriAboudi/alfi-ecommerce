import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { allAsync, getAsync, runAsync } from '../database-pg.js';

const router = express.Router();

// Get customer orders
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await allAsync(`
      SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC
    `, [customerId]);

    res.json({
      success: true,
      count: orders.length,
      orders: orders.map(o => ({
        id: o.id,
        orderNumber: o.order_number,
        customerId: o.customer_id,
        orderDate: o.order_date,
        status: o.status,
        totalAmount: parseFloat(o.total_amount),
        deliveryDate: o.delivery_date,
        deliveryTime: o.delivery_time,
        notes: o.notes
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT o.*, c.customer_name, c.customer_number 
      FROM orders o 
      JOIN customers c ON o.customer_id = c.id
    `;
    let params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const orders = await allAsync(query, params);

    res.json({
      success: true,
      count: orders.length,
      orders: orders.map(o => ({
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        customerNumber: o.customer_number,
        customerId: o.customer_id,
        orderDate: o.order_date,
        status: o.status,
        totalAmount: parseFloat(o.total_amount),
        deliveryDate: o.delivery_date,
        deliveryTime: o.delivery_time,
        notes: o.notes,
        confirmedAt: o.confirmed_at
      }))
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details with items
router.get('/:orderId/details', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getAsync(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await allAsync(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );

    res.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        customerId: order.customer_id,
        orderDate: order.order_date,
        status: order.status,
        totalAmount: parseFloat(order.total_amount),
        deliveryDate: order.delivery_date,
        deliveryTime: order.delivery_time,
        notes: order.notes
      },
      items: items.map(i => ({
        id: i.id,
        itemId: i.item_id,
        productName: i.name,
        quantity: i.quantity,
        price: parseFloat(i.price),
        subtotal: parseFloat(i.subtotal)
      }))
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { customerId, customerNumber, items, deliveryDate, deliveryTime, notes } = req.body;

    if (!customerId || !customerNumber || !items || items.length === 0) {
      return res.status(400).json({ 
        error: 'customerId, customerNumber, and items are required' 
      });
    }

    // Calculate total
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += parseFloat(item.price) * item.quantity;
    });

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Insert order
    const orderResult = await runAsync(
      `INSERT INTO orders 
       (order_number, customer_id, customer_number, status, total_amount, delivery_date, delivery_time, notes) 
       VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [orderNumber, customerId, customerNumber, totalAmount, deliveryDate, deliveryTime, notes || '']
    );

    const orderId = orderResult.id;

    // Insert order items
    for (const item of items) {
      const subtotal = parseFloat(item.price) * item.quantity;
      await runAsync(
        `INSERT INTO order_items 
         (order_id, product_id, item_id, name, quantity, price, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.itemId, item.productName, item.quantity, item.price, subtotal]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: orderId,
        orderNumber,
        customerId,
        status: 'pending',
        totalAmount,
        itemCount: items.length
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order (change quantity, remove items, etc)
router.put('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { items, deliveryDate, deliveryTime, notes } = req.body;

    // Delete existing order items
    await runAsync('DELETE FROM order_items WHERE order_id = $1', [orderId]);

    // Calculate new total
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += parseFloat(item.price) * item.quantity;
    });

    // Update order
    await runAsync(
      `UPDATE orders 
       SET total_amount = ?, delivery_date = ?, delivery_time = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [totalAmount, deliveryDate, deliveryTime, notes, orderId]
    );

    // Insert new order items
    for (const item of items) {
      const subtotal = parseFloat(item.price) * item.quantity;
      await runAsync(
        `INSERT INTO order_items 
         (order_id, product_id, item_id, name, quantity, price, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.itemId, item.productName, item.quantity, item.price, subtotal]
      );
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      totalAmount
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Confirm order (admin)
router.post('/:orderId/confirm', async (req, res) => {
  try {
    const { orderId } = req.params;

    await runAsync(
      `UPDATE orders SET status = 'confirmed', confirmed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [orderId]
    );

    res.json({
      success: true,
      message: 'Order confirmed successfully'
    });
  } catch (error) {
    console.error('Error confirming order:', error);
    res.status(500).json({ error: 'Failed to confirm order' });
  }
});

// Delete order
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    await runAsync('DELETE FROM orders WHERE id = $1', [orderId]);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;