const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, adminOnly, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, orderController.createOrder);
router.get('/', verifyToken, orderController.getOrders);
router.get('/:id', optionalAuth, orderController.getOrderById);
router.put('/:id/status', verifyToken, adminOnly, orderController.updateOrderStatus);
router.post('/:id/cancel', optionalAuth, orderController.cancelOrder);

module.exports = router;
