const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, adminOnly, optionalAuth } = require('../middleware/auth');

router.get('/', reviewController.getReviews);
router.post('/', optionalAuth, reviewController.createReview);
router.patch('/:id/status', verifyToken, adminOnly, reviewController.updateReviewStatus);
router.delete('/:id', verifyToken, adminOnly, reviewController.deleteReview);

module.exports = router;
