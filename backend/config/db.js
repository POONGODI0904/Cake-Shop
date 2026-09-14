const mongoose = require('mongoose');
const storage = require('../services/storageService');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweetcrumb';
  try {
    // Attempt Mongoose connection if server available
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Successfully connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.log(`[Database Notice] MongoDB not running locally (${error.message}).`);
    console.log(`[Database Notice] Automatically using persistent dynamic JSON database engine (sweetcrumb/backend/data/db.json).`);
    console.log(`[Database Notice] All products, orders, users, reviews, coupons & banners are fully dynamic and persisted.`);
    return false;
  }
};

module.exports = connectDB;
