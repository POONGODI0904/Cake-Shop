const jwt = require('jsonwebtoken');
const storage = require('../services/storageService');

const JWT_SECRET = process.env.JWT_SECRET || 'sweetcrumb_super_secret_jwt_key_2026';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = storage.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found or account deactivated.' });
    }
    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account has been blocked. Please contact support.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Administrator privileges required.' });
  }
  next();
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = storage.getUserById(decoded.id);
      if (user && user.status !== 'blocked') {
        req.user = user;
      }
    } catch (e) {
      // ignore for optional auth
    }
  }
  next();
};

module.exports = {
  verifyToken,
  adminOnly,
  optionalAuth,
  JWT_SECRET
};
