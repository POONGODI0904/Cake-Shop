const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const storage = require('../services/storageService');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
exports.register = (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existing = storage.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = storage.createUser({
      name,
      email,
      phone: phone || '',
      passwordHash,
      role: 'customer'
    });

    const token = generateToken(newUser);
    return res.status(201).json({
      message: 'Registration successful! Welcome to SweetCrumb.',
      token,
      user: newUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed: ' + error.message });
  }
};

// POST /api/auth/login
exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = storage.data.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() || 
      (u.phone && u.phone === email)
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: 'Your account is blocked. Please contact customer support.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const { passwordHash, ...safeUser } = user;
    const token = generateToken(safeUser);

    return res.json({
      message: 'Logged in successfully!',
      token,
      user: safeUser
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed: ' + error.message });
  }
};

// GET /api/auth/me
exports.getProfile = (req, res) => {
  try {
    const user = storage.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { passwordHash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = (req, res) => {
  try {
    const { name, phone } = req.body;
    const updated = storage.updateUser(req.user.id, {
      ...(name && { name }),
      ...(phone && { phone })
    });
    return res.json({ message: 'Profile updated successfully!', user: updated });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/change-password
exports.changePassword = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = storage.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    storage.persist();
    return res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const user = storage.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'No account registered with this email address.' });
  }
  // In demo environment, provide instant reset simulation token
  const resetToken = 'RESET-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  return res.json({
    message: 'Password reset link sent to your email (simulated for demonstration).',
    resetToken
  });
};

// POST /api/auth/reset-password
exports.resetPassword = (req, res) => {
  const { email, newPassword } = req.body;
  const user = storage.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  storage.persist();
  return res.json({ message: 'Password has been reset successfully. You can now login.' });
};

// --- Address Management ---
// POST /api/auth/address
exports.addAddress = (req, res) => {
  try {
    const { name, phone, houseNo, street, area, city, state, pincode, landmark, isDefault } = req.body;
    const user = storage.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses || [];
    if (isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    const newAddress = {
      id: `addr-${Date.now()}`,
      name,
      phone,
      houseNo,
      street,
      area: area || '',
      city,
      state,
      pincode,
      landmark: landmark || '',
      isDefault: isDefault || user.addresses.length === 0
    };

    user.addresses.push(newAddress);
    storage.persist();
    return res.status(201).json({ message: 'Address saved successfully!', addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/address/:addressId
exports.updateAddress = (req, res) => {
  try {
    const { addressId } = req.params;
    const user = storage.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addrIndex = (user.addresses || []).findIndex(a => a.id === addressId);
    if (addrIndex === -1) return res.status(404).json({ message: 'Address not found' });

    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses[addrIndex] = { ...user.addresses[addrIndex], ...req.body };
    storage.persist();
    return res.json({ message: 'Address updated successfully!', addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/auth/address/:addressId
exports.deleteAddress = (req, res) => {
  try {
    const { addressId } = req.params;
    const user = storage.data.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = (user.addresses || []).filter(a => a.id !== addressId);
    storage.persist();
    return res.json({ message: 'Address deleted successfully!', addresses: user.addresses });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
