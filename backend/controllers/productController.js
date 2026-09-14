const storage = require('../services/storageService');

// GET /api/products
exports.getAllProducts = (req, res) => {
  try {
    const products = storage.getProducts(req.query);
    return res.json({
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching products: ' + error.message });
  }
};

// GET /api/products/suggestions?q=
exports.getLiveSuggestions = (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase().trim();
    if (!query) return res.json({ suggestions: [] });

    const all = storage.getProducts({});
    const matches = all.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.flavour.toLowerCase().includes(query)
    ).slice(0, 6);

    const suggestions = matches.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.images?.front || (typeof p.images === 'string' ? p.images : ''),
      slug: p.slug
    }));

    return res.json({ suggestions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
exports.getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Cake product not found.' });
    }

    // Get related products from same category
    const related = storage.getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 4);

    // Get reviews for this product
    const reviews = storage.getReviews(product.id);

    return res.json({
      product,
      related,
      reviews
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/products (Admin)
exports.createProduct = (req, res) => {
  try {
    const {
      name,
      category,
      description,
      ingredients,
      flavour,
      weights,
      price,
      originalPrice,
      discountPercentage,
      stock,
      sku,
      eggType,
      images,
      featured,
      bestseller,
      status
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Name, category, and price are required.' });
    }

    // Default weight options if not provided
    const basePrice = Number(price);
    const weightList = weights && weights.length ? weights : [
      { weight: '500g', price: basePrice, serves: '4-5 people' },
      { weight: '1kg', price: Math.round(basePrice * 1.85), serves: '8-10 people' },
      { weight: '1.5kg', price: Math.round(basePrice * 2.7), serves: '12-14 people' },
      { weight: '2kg', price: Math.round(basePrice * 3.5), serves: '16-18 people' },
      { weight: '3kg', price: Math.round(basePrice * 5.1), serves: '24-28 people' }
    ];

    const imageMap = typeof images === 'object' && images !== null ? images : {
      front: typeof images === 'string' ? images : 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
      side: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop',
      top: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop',
      closeup: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop'
    };

    const newProduct = storage.createProduct({
      name,
      category,
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || 'Artisanal freshly baked cake crafted with premium ingredients.',
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : ['Pure Vanilla', 'Flour', 'Butter', 'Cream']),
      allergens: req.body.allergens || ['Dairy', 'Gluten'],
      flavour: flavour || 'Chocolate',
      weights: weightList,
      price: basePrice,
      originalPrice: Number(originalPrice) || Math.round(basePrice * 1.15),
      discountPercentage: Number(discountPercentage) || Math.round((((Number(originalPrice) || (basePrice * 1.15)) - basePrice) / (Number(originalPrice) || (basePrice * 1.15))) * 100),
      stock: Number(stock) !== undefined ? Number(stock) : 20,
      sku: sku || `SWT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      eggType: eggType || 'Eggless',
      images: imageMap,
      featured: Boolean(featured),
      bestseller: Boolean(bestseller),
      status: status || 'active'
    });

    return res.status(201).json({
      message: 'Cake product created successfully!',
      product: newProduct
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product: ' + error.message });
  }
};

// PUT /api/products/:id (Admin)
exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({
      message: 'Product updated successfully!',
      product: updated
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id (Admin)
exports.deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json({ message: 'Product removed successfully!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/products/:id/stock (Admin)
exports.updateStock = (req, res) => {
  try {
    const { id } = req.params;
    const { stock, delta } = req.body;
    const product = storage.getProductById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (stock !== undefined) {
      product.stock = Math.max(0, Number(stock));
    } else if (delta !== undefined) {
      product.stock = Math.max(0, (product.stock || 0) + Number(delta));
    }
    storage.persist();

    return res.json({
      message: 'Stock updated successfully!',
      stock: product.stock,
      product
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
