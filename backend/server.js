import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initDatabase, getDB } from './database.js';
import customerRoutes from './routes/customers.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database
initDatabase();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ח.ס אלפי - E-Commerce API',
    version: '1.0.0',
    api: 'http://localhost:5000/api'
  });
});

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// API root
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ח.ס אלפי API',
    endpoints: {
      customers: '/api/customers',
      categories: '/api/categories',
      products: '/api/products',
      orders: '/api/orders',
      admin: '/api/admin',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ח.ס אלפי Server is running on port ${PORT}`);
  console.log(`📊 Database initialized`);
  console.log(`🔗 API available at http://localhost:${PORT}/api\n`);
});

export default app;