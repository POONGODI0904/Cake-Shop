const storage = require('../services/storageService');

exports.getBanners = (req, res) => {
  try {
    return res.json({ banners: storage.getBanners() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createBanner = (req, res) => {
  try {
    const { heading, description, buttonText, buttonLink, image } = req.body;
    if (!heading || !image) {
      return res.status(400).json({ message: 'Heading and image are required.' });
    }
    const newBanner = storage.createBanner({
      heading,
      description: description || '',
      buttonText: buttonText || 'Shop Now',
      buttonLink: buttonLink || '/cakes',
      image
    });
    return res.status(201).json({ message: 'Banner created successfully!', banner: newBanner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateBanner = (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.updateBanner(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Banner not found' });
    return res.json({ message: 'Banner updated successfully!', banner: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteBanner = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteBanner(id);
    if (!deleted) return res.status(404).json({ message: 'Banner not found' });
    return res.json({ message: 'Banner deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
