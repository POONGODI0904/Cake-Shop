const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.post('/validate', couponController.validateCoupon);
router.get('/', couponController.getCoupons);
router.post('/', verifyToken, adminOnly, couponController.createCoupon);
router.delete('/:id', verifyToken, adminOnly, couponController.deleteCoupon);

module.exports = router;
