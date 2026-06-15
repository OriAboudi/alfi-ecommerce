import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase, getDB } from './database.js';
import customerRoutes from './routes/customers.js';
import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

// Middleware - Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Initialize database
initDatabase();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ח.ס אלפי - E-Commerce API',
    version: '1.0.0',
    status: '✅ Server running',
    environment: NODE_ENV,
    api: `${FRONTEND_URL}/api`
  });
});
app.use('/customers', customerRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);


// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ח.ס אלפי API',
    status: '✅ API is available',
    version: '1.0.0',
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    availableEndpoints: '/api'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  const statusCode = err.statusCode || 500;
  const response = {
    error: 'Internal server error',
    status: statusCode
  };
  
  // Include error details in development
  if (NODE_ENV === 'development') {
    response.message = err.message;
    response.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 ח.ס אלפי Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${NODE_ENV}`);
  console.log(`✅ CORS enabled for: ${FRONTEND_URL}`);
  console.log(`📊 Database initialized`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
  console.log('='.repeat(50) + '\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n📛 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📛 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

export default app;