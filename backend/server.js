const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const couponRoutes = require('./routes/couponRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (MongoDB or persistent JSON store)
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/preview
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SweetCrumb Cake Shop API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎂 SweetCrumb Cake Shop Server listening on port ${PORT}`);
  console.log(`   Customer API:  http://localhost:${PORT}/api/products`);
  console.log(`   Admin API:     http://localhost:${PORT}/api/admin/stats`);
  console.log(`   Health check:  http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
