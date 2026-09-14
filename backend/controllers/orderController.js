const storage = require('../services/storageService');

// POST /api/orders
exports.createOrder = (req, res) => {
  try {
    const {
      items,
      subtotal,
      discount,
      deliveryFee,
      tax,
      total,
      couponApplied,
      address,
      deliveryDate,
      deliveryTime,
      paymentMethod,
      giftMessage,
      customerNotes
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart items are required to place an order.' });
    }

    if (!address || !address.name || !address.phone || !address.city || !address.pincode) {
      return res.status(400).json({ message: 'A complete delivery address is required.' });
    }

    // Verify stock availability
    for (const item of items) {
      if (item.productId && !item.isCustom) {
        const prod = storage.getProductById(item.productId);
        if (prod && prod.stock < (item.quantity || 1)) {
          return res.status(400).json({
            message: `Sorry, "${prod.name}" only has ${prod.stock} items remaining in stock.`
          });
        }
      }
    }

    const userId = req.user ? req.user.id : (req.body.userId || 'guest-' + Date.now());
    const customerName = address.name || (req.user ? req.user.name : 'Valued Customer');
    const customerEmail = (req.user ? req.user.email : req.body.customerEmail) || 'guest@sweetcrumb.com';
    const customerPhone = address.phone || (req.user ? req.user.phone : '');

    const newOrder = storage.createOrder({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      tax: Number(tax) || 0,
      total: Number(total) || 0,
      couponApplied: couponApplied || null,
      address,
      deliveryDate: deliveryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTime: deliveryTime || 'Afternoon (12:00 PM - 4:00 PM)',
      paymentMethod: paymentMethod || 'Online Payment',
      giftMessage: giftMessage || '',
      customerNotes: customerNotes || ''
    });

    // Update coupon usage count if applied
    if (couponApplied) {
      const cpn = storage.getCouponByCode(couponApplied);
      if (cpn) {
        cpn.usedCount = (cpn.usedCount || 0) + 1;
        storage.persist();
      }
    }

    return res.status(201).json({
      message: 'Order placed successfully! Freshness is on the way.',
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to place order: ' + error.message });
  }
};

// GET /api/orders
exports.getOrders = (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};

    // If customer, only show customer orders
    if (req.user && req.user.role !== 'admin') {
      filter.userId = req.user.id;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    let orders = storage.getOrders(filter);

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(q))
      );
    }

    return res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = (req, res) => {
  try {
    const { id } = req.params;
    const order = storage.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Guard: Customer can only view own orders unless admin
    if (req.user && req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this order.' });
    }

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/orders/:id/status (Admin)
exports.updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = storage.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (status) {
      storage.updateOrderStatus(id, status);
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      storage.persist();
    }

    const updated = storage.getOrderById(id);
    return res.json({
      message: `Order status updated to "${status || order.orderStatus}" successfully!`,
      order: updated
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/orders/:id/cancel
exports.cancelOrder = (req, res) => {
  try {
    const { id } = req.params;
    const order = storage.getOrderById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user && req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be cancelled.' });
    }

    storage.updateOrderStatus(id, 'Cancelled');
    return res.json({ message: 'Order cancelled successfully', order: storage.getOrderById(id) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
