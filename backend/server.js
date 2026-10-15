const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const {testConnection }=require('./src/config/database')
testConnection();
// Add this after testConnection();
const { createTables } = require('./src/config/migrations');

// Run migrations on startup
createTables();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AbdiDelivery Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      foods: '/api/foods',
      orders: '/api/orders',
      admin: '/api/admin'
    }
  });
});


 app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/foods', require('./src/routes/foods'));
 app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/admin', require('./src/routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` API URL: http://localhost:${PORT}`);
});