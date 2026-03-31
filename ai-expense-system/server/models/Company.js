const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  defaultCurrency: { type: String, required: true, default: 'USD' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
