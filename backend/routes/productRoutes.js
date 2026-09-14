const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/', productController.getAllProducts);
router.get('/suggestions', productController.getLiveSuggestions);
router.get('/:id', productController.getProductById);

// Admin-protected routes
router.post('/', verifyToken, adminOnly, productController.createProduct);
router.put('/:id', verifyToken, adminOnly, productController.updateProduct);
router.delete('/:id', verifyToken, adminOnly, productController.deleteProduct);
router.patch('/:id/stock', verifyToken, adminOnly, productController.updateStock);

module.exports = router;
