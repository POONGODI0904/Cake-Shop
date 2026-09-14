const storage = require('../services/storageService');

// POST /api/coupons/validate
exports.validateCoupon = (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = storage.getCouponByCode(code.trim());
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code.' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'This coupon code has expired.' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'This coupon usage limit has been reached.' });
    }

    const total = Number(cartTotal) || 0;
    if (total < coupon.minimumAmount) {
      return res.status(400).json({
        message: `Minimum order amount of ₹${coupon.minimumAmount} required for this coupon.`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((total * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return res.json({
      valid: true,
      message: `Coupon "${coupon.code}" applied! You saved ₹${discountAmount}.`,
      discountAmount,
      coupon
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/coupons
exports.getCoupons = (req, res) => {
  try {
    return res.json({ coupons: storage.getCoupons() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/coupons (Admin)
exports.createCoupon = (req, res) => {
  try {
    const { code, discountType, discountValue, minimumAmount, maximumDiscount, expiryDate, usageLimit } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ message: 'Code and discount value are required.' });
    }

    const existing = storage.getCouponByCode(code);
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists.' });
    }

    const newCoupon = storage.createCoupon({
      code: code.toUpperCase().trim(),
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minimumAmount: Number(minimumAmount) || 0,
      maximumDiscount: Number(maximumDiscount) || 500,
      expiryDate: expiryDate || '2027-12-31',
      usageLimit: Number(usageLimit) || 500
    });

    return res.status(201).json({ message: 'Coupon created successfully!', coupon: newCoupon });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/coupons/:id (Admin)
exports.deleteCoupon = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteCoupon(id);
    if (!deleted) return res.status(404).json({ message: 'Coupon not found' });
    return res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
