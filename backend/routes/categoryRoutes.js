const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', verifyToken, adminOnly, categoryController.createCategory);
router.put('/:id', verifyToken, adminOnly, categoryController.updateCategory);
router.delete('/:id', verifyToken, adminOnly, categoryController.deleteCategory);

module.exports = router;
