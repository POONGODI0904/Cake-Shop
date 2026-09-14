const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/me', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/change-password', verifyToken, authController.changePassword);

router.post('/address', verifyToken, authController.addAddress);
router.put('/address/:addressId', verifyToken, authController.updateAddress);
router.delete('/address/:addressId', verifyToken, authController.deleteAddress);

module.exports = router;
