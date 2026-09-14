const fs = require('fs');
const path = require('path');
const {
  categories,
  products,
  coupons,
  banners,
  reviews,
  initialUsers,
  initialOrders
} = require('../data/seedData');

const DB_FILE = path.join(__dirname, '../data/db.json');

class StorageService {
  constructor() {
    this.data = {
      users: [],
      products: [],
      categories: [],
      orders: [],
      coupons: [],
      banners: [],
      reviews: []
    };
    this.init();
  }

  init() {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || initialUsers,
          products: parsed.products || products,
          categories: parsed.categories || categories,
          orders: parsed.orders || initialOrders,
          coupons: parsed.coupons || coupons,
          banners: parsed.banners || banners,
          reviews: parsed.reviews || reviews
        };
        console.log(`[Database] Loaded persistent data from ${DB_FILE}`);
        return;
      } catch (err) {
        console.error('[Database] Failed parsing existing db.json, re-seeding...', err);
      }
    }

    // Seed initial dataset
    this.data = {
      users: initialUsers,
      products: products,
      categories: categories,
      orders: initialOrders,
      coupons: coupons,
      banners: banners,
      reviews: reviews
    };
    this.persist();
    console.log(`[Database] Initialized and seeded database at ${DB_FILE}`);
  }

  persist() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Database] Persistence write error:', err);
    }
  }

  // --- Products ---
  getProducts(filter = {}) {
    let result = [...this.data.products];

    if (filter.category) {
      result = result.filter(p => 
        p.category.toLowerCase() === filter.category.toLowerCase() ||
        p.categorySlug === filter.category.toLowerCase()
      );
    }
    if (filter.flavour) {
      result = result.filter(p => p.flavour.toLowerCase() === filter.flavour.toLowerCase());
    }
    if (filter.eggType) {
      result = result.filter(p => p.eggType.toLowerCase() === filter.eggType.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.flavour.toLowerCase().includes(q)
      );
    }
    if (filter.minPrice) {
      result = result.filter(p => p.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice) {
      result = result.filter(p => p.price <= Number(filter.maxPrice));
    }
    if (filter.rating) {
      result = result.filter(p => p.rating >= Number(filter.rating));
    }
    if (filter.featured === 'true' || filter.featured === true) {
      result = result.filter(p => p.featured);
    }
    if (filter.bestseller === 'true' || filter.bestseller === true) {
      result = result.filter(p => p.bestseller);
    }
    if (filter.inStock === 'true' || filter.inStock === true) {
      result = result.filter(p => p.stock > 0);
    }

    // Sort
    if (filter.sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filter.sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filter.sort === 'best-rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (filter.sort === 'discount') {
      result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else if (filter.sort === 'popular') {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return result;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id || p._id === id || p.slug === id);
  }

  createProduct(productData) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      _id: `prod-${Date.now()}`,
      slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewsCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...productData
    };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.data.products.findIndex(p => p.id === id || p._id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.persist();
    return this.data.products[index];
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id || p._id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.persist();
    return true;
  }

  adjustStock(productId, amountChange) {
    const product = this.getProductById(productId);
    if (!product) return null;
    product.stock = Math.max(0, (product.stock || 0) + amountChange);
    this.persist();
    return product;
  }

  // --- Categories ---
  getCategories() {
    return this.data.categories;
  }

  createCategory(categoryData) {
    const newCategory = {
      id: `cat-${Date.now()}`,
      _id: `cat-${Date.now()}`,
      slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'active',
      createdAt: new Date().toISOString(),
      ...categoryData
    };
    this.data.categories.push(newCategory);
    this.persist();
    return newCategory;
  }

  updateCategory(id, updates) {
    const index = this.data.categories.findIndex(c => c.id === id || c._id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.persist();
    return this.data.categories[index];
  }

  deleteCategory(id) {
    const index = this.data.categories.findIndex(c => c.id === id || c._id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Orders ---
  getOrders(filter = {}) {
    let result = [...this.data.orders];
    if (filter.userId) {
      result = result.filter(o => o.userId === filter.userId);
    }
    if (filter.status && filter.status !== 'all') {
      result = result.filter(o => o.orderStatus.toLowerCase() === filter.status.toLowerCase());
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id || o._id === id || o.orderNumber === id);
  }

  createOrder(orderData) {
    const orderNumber = `SWT-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      _id: `ord-${Date.now()}`,
      orderNumber,
      orderStatus: 'Confirmed',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      createdAt: new Date().toISOString(),
      statusTimeline: [
        { status: 'Order Placed', timestamp: new Date().toISOString(), completed: true },
        { status: 'Order Confirmed', timestamp: new Date().toISOString(), completed: true },
        { status: 'Baking', timestamp: null, completed: false },
        { status: 'Ready for Delivery', timestamp: null, completed: false },
        { status: 'Out for Delivery', timestamp: null, completed: false },
        { status: 'Delivered', timestamp: null, completed: false }
      ],
      ...orderData
    };

    // Auto-decrement inventory stock for standard products
    if (orderData.items && Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        if (item.productId) {
          this.adjustStock(item.productId, -(item.quantity || 1));
        }
      });
    }

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  updateOrderStatus(id, newStatus) {
    const order = this.getOrderById(id);
    if (!order) return null;

    order.orderStatus = newStatus;
    const timelineStatuses = ['Order Placed', 'Order Confirmed', 'Baking', 'Ready for Delivery', 'Out for Delivery', 'Delivered'];
    const currentIdx = timelineStatuses.findIndex(s => s.toLowerCase() === newStatus.toLowerCase());

    if (currentIdx !== -1) {
      order.statusTimeline = timelineStatuses.map((name, idx) => {
        const existing = (order.statusTimeline || []).find(t => t.status.toLowerCase() === name.toLowerCase());
        const isCompleted = idx <= currentIdx;
        return {
          status: name,
          completed: isCompleted,
          timestamp: isCompleted ? (existing?.timestamp || new Date().toISOString()) : null
        };
      });
    } else if (newStatus.toLowerCase() === 'cancelled') {
      order.statusTimeline.push({
        status: 'Cancelled',
        completed: true,
        timestamp: new Date().toISOString()
      });
    }

    this.persist();
    return order;
  }

  // --- Users ---
  getUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id || u._id === id);
  }

  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const newUser = {
      id: `user-${Date.now()}`,
      _id: `user-${Date.now()}`,
      role: userData.role || 'customer',
      status: 'active',
      addresses: [],
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.data.users.push(newUser);
    this.persist();
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  updateUser(id, updates) {
    const index = this.data.users.findIndex(u => u.id === id || u._id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.persist();
    const { passwordHash, ...safeUser } = this.data.users[index];
    return safeUser;
  }

  deleteUser(id) {
    const index = this.data.users.findIndex(u => u.id === id || u._id === id);
    if (index === -1) return false;
    this.data.users.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Coupons ---
  getCoupons() {
    return this.data.coupons;
  }

  getCouponByCode(code) {
    return this.data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.status === 'active');
  }

  createCoupon(couponData) {
    const newCoupon = {
      id: `cpn-${Date.now()}`,
      _id: `cpn-${Date.now()}`,
      usedCount: 0,
      status: 'active',
      ...couponData
    };
    this.data.coupons.push(newCoupon);
    this.persist();
    return newCoupon;
  }

  deleteCoupon(id) {
    const index = this.data.coupons.findIndex(c => c.id === id || c._id === id);
    if (index === -1) return false;
    this.data.coupons.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Banners ---
  getBanners() {
    return this.data.banners;
  }

  createBanner(bannerData) {
    const newBanner = {
      id: `ban-${Date.now()}`,
      _id: `ban-${Date.now()}`,
      status: 'active',
      ...bannerData
    };
    this.data.banners.push(newBanner);
    this.persist();
    return newBanner;
  }

  updateBanner(id, updates) {
    const index = this.data.banners.findIndex(b => b.id === id || b._id === id);
    if (index === -1) return null;
    this.data.banners[index] = { ...this.data.banners[index], ...updates };
    this.persist();
    return this.data.banners[index];
  }

  deleteBanner(id) {
    const index = this.data.banners.findIndex(b => b.id === id || b._id === id);
    if (index === -1) return false;
    this.data.banners.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Reviews ---
  getReviews(productId = null) {
    if (productId) {
      return this.data.reviews.filter(r => r.productId === productId);
    }
    return this.data.reviews;
  }

  createReview(reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      _id: `rev-${Date.now()}`,
      status: 'approved',
      createdAt: new Date().toISOString(),
      ...reviewData
    };
    this.data.reviews.unshift(newReview);

    // Update product rating and reviews count
    const product = this.getProductById(reviewData.productId);
    if (product) {
      const prodReviews = this.data.reviews.filter(r => r.productId === product.id && r.status === 'approved');
      const avg = prodReviews.reduce((sum, r) => sum + Number(r.rating), 0) / prodReviews.length;
      product.rating = Math.round(avg * 10) / 10;
      product.reviewsCount = prodReviews.length;
    }

    this.persist();
    return newReview;
  }

  updateReviewStatus(id, status) {
    const review = this.data.reviews.find(r => r.id === id || r._id === id);
    if (!review) return null;
    review.status = status;
    this.persist();
    return review;
  }

  deleteReview(id) {
    const index = this.data.reviews.findIndex(r => r.id === id || r._id === id);
    if (index === -1) return false;
    this.data.reviews.splice(index, 1);
    this.persist();
    return true;
  }
}

const storage = new StorageService();
module.exports = storage;
