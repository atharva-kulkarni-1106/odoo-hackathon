const express = require('express');
const router = express.Router();
const axios = require('axios');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Company = require('../models/Company');
const aiService = require('../services/aiService');
const { protect, authorize } = require('../middleware/auth');

// POST /api/expenses - Submit Expense
router.post('/', protect, async (req, res) => {
  try {
    const { amount, currency, category, description, date, receiptUrl } = req.body;
    
    // Fallback company verification
    const company = await Company.findById(req.user.companyId);
    if (!company) return res.status(404).json({ error: 'Company config error' });
    const defaultCurrency = company.defaultCurrency;

    let convertedAmount = amount;
    
    // Live Multi-Currency Conversion using exchangerate-api
    if (currency !== defaultCurrency) {
      try {
        const rateRes = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const rate = rateRes.data.rates[defaultCurrency];
        if (rate) {
          convertedAmount = amount * rate;
        }
      } catch (err) {
        console.log('Exchange rate API failed. Defaulting to 1:1 ratio.', err.message);
      }
    }

    // Triggers internal AI services synchronously
    const aiInsights = aiService.analyzeExpense(amount, currency, date, category, description);

    const expense = await Expense.create({
      userId: req.user._id,
      companyId: req.user.companyId,
      amount,
      currency,
      convertedAmount,
      category,
      description,
      date,
      receiptUrl,
      status: 'PENDING_MANAGER',
      aiInsights,
      historyLog: [{
        action: 'SUBMITTED',
        actorId: req.user._id,
        comments: 'Expense submitted via dashboard.'
      }]
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/expenses - View Expenses based on RBAC
router.get('/', protect, async (req, res) => {
  try {
    let filter = { companyId: req.user.companyId };
    
    if (req.user.role === 'ADMIN') {
      // Unbounded visibility
    } else if (req.user.role === 'MANAGER') {
      // Managers see ALL pending expenses inside the company to ensure the queue populates instantly without complex assignment structures
      filter.status = 'PENDING_MANAGER';
    } else {
      // Employee bounds
      filter.userId = req.user._id;
    }

    const expenses = await Expense.find(filter)
                                  .populate('userId', 'name email role')
                                  .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses/:id/approve - State-machine workflow
router.post('/:id/approve', protect, authorize('MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const { comments } = req.body;
    const expense = await Expense.findById(req.params.id).populate('userId');

    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    if (expense.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ error: 'Tenant boundary violation' });
    }

    // Admin Override Feature -> Fast-tracks to APPROVED
    if (req.user.role === 'ADMIN') {
      expense.status = 'APPROVED';
      expense.historyLog.push({ action: 'ADMIN_APPROVED', actorId: req.user._id, comments: comments || 'Admin Auto-Approve Override applies' });
      await expense.save();
      return res.json(expense);
    }

    // Linear Workflow -> Manager to Finance
    if (req.user.role === 'MANAGER') {
      // Removed strict manager reporting map for Hackathon so any manager can approve any request

      if (expense.status === 'PENDING_MANAGER') {
        expense.status = 'PENDING_FINANCE';
        expense.historyLog.push({ action: 'MANAGER_APPROVED', actorId: req.user._id, comments: comments || 'Standard Manager Approval' });
        await expense.save();
        return res.json(expense);
      } else {
        return res.status(400).json({ error: `State transition error. Expense is currently ${expense.status}` });
      }
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/expenses/:id/reject
router.post('/:id/reject', protect, authorize('MANAGER', 'ADMIN'), async (req, res) => {
  try {
    const { comments } = req.body;
    if (!comments) return res.status(400).json({ error: 'Rejection requires a documented reason' });

    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });

    expense.status = 'REJECTED';
    expense.historyLog.push({ action: 'REJECTED', actorId: req.user._id, comments });
    
    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
