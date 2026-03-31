const mongoose = require('mongoose');

// Embedded Schema for AI processing results
const AIInsightsSchema = new mongoose.Schema({
  isSuspicious: { type: Boolean, default: false },
  fraudReason: { type: String, default: null },
  smartSuggestion: { type: String, enum: ['APPROVE', 'REVIEW', 'REJECT'], default: 'REVIEW' },
  suggestionReason: { type: String, default: null },
  story: { type: String, default: null },
  moodWarning: { type: Boolean, default: false }
}, { _id: false });

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  convertedAmount: { type: Number, required: true }, // Base currency equivalent
  category: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  receiptUrl: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING_MANAGER', 'PENDING_FINANCE', 'APPROVED', 'REJECTED'], 
    default: 'PENDING_MANAGER' 
  },
  aiInsights: { type: AIInsightsSchema, default: () => ({}) },
  historyLog: [{
    action: { type: String }, // e.g., 'SUBMITTED', 'APPROVED_BY_MANAGER', 'REJECTED'
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', ExpenseSchema);
