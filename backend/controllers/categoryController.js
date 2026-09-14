const storage = require('../services/storageService');

exports.getCategories = (req, res) => {
  try {
    const categories = storage.getCategories();
    // Count products per category dynamically
    const categoriesWithCount = categories.map(cat => {
      const count = storage.data.products.filter(p => 
        p.category.toLowerCase() === cat.name.toLowerCase() ||
        p.categorySlug === cat.slug
      ).length;
      return { ...cat, productCount: count };
    });
    return res.json({ categories: categoriesWithCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createCategory = (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const newCat = storage.createCategory({
      name,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'
    });
    return res.status(201).json({ message: 'Category created successfully!', category: newCat });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.updateCategory(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    return res.json({ message: 'Category updated successfully!', category: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteCategory(id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    return res.json({ message: 'Category deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
