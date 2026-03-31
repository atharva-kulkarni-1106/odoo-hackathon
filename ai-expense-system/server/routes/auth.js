const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const Company = require('../models/Company');

// POST /api/auth/signup
// Auto-creates company, sets default currency based on country, creates Admin user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, companyName, countryName } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Auto-detect currency via Country name
    let defaultCurrency = 'USD';
    try {
      if (countryName) {
        // e.g., 'United States', 'India', 'France'
        const countryRes = await axios.get(`https://restcountries.com/v3.1/name/${countryName}?fields=name,currencies`);
        if (countryRes.data && countryRes.data.length > 0) {
          const currencies = countryRes.data[0].currencies;
          defaultCurrency = Object.keys(currencies)[0];
        }
      }
    } catch (err) {
      console.log('Error fetching currency, falling back to USD.', err.message);
    }

    const company = await Company.create({
      name: companyName,
      defaultCurrency
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company._id
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'hackathon_secret_123', {
      expiresIn: '30d'
    });

    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role, company: company } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('companyId');

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'hackathon_secret_123', {
      expiresIn: '30d'
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, company: user.companyId } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
