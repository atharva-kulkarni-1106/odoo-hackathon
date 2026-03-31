const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// POST /api/users
// Admin creates downstream employees and managers
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'EMPLOYEE',
      companyId: req.user.companyId,
      managerId: managerId || null
    });

    res.status(201).json({ id: user._id, name: user.name, role: user.role, managerId: user.managerId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users
router.get('/', protect, authorize('ADMIN', 'MANAGER'), async (req, res) => {
  try {
    const users = await User.find({ companyId: req.user.companyId })
                            .select('-password')
                            .populate('managerId', 'name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
