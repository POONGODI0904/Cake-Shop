const storage = require('../services/storageService');

exports.getReviews = (req, res) => {
  try {
    const { productId } = req.query;
    const reviews = storage.getReviews(productId);
    return res.json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createReview = (req, res) => {
  try {
    const { productId, rating, review, image } = req.body;
    if (!productId || !rating || !review) {
      return res.status(400).json({ message: 'Product ID, rating, and review text are required.' });
    }

    const product = storage.getProductById(productId);
    const userId = req.user ? req.user.id : 'guest-' + Date.now();
    const userName = req.user ? req.user.name : (req.body.userName || 'Anonymous Sweet Lover');

    const newReview = storage.createReview({
      productId,
      productName: product ? product.name : 'Delight Cake',
      userId,
      userName,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: Number(rating),
      review,
      image: image || null
    });

    return res.status(201).json({
      message: 'Thank you! Your review has been published.',
      review: newReview
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateReviewStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = storage.updateReviewStatus(id, status);
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    return res.json({ message: 'Review status updated', review: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteReview(id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    return res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
