const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/', bannerController.getBanners);
router.post('/', verifyToken, adminOnly, bannerController.createBanner);
router.put('/:id', verifyToken, adminOnly, bannerController.updateBanner);
router.delete('/:id', verifyToken, adminOnly, bannerController.deleteBanner);

module.exports = router;
