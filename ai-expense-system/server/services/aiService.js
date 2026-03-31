// services/aiService.js

/**
 * Simulates AI Fraud Detection
 * Flags weekend submissions or unusually high amounts.
 */
exports.detectFraud = (amount, dateString, category) => {
  const date = new Date(dateString);
  const day = date.getDay();
  const isWeekend = (day === 0 || day === 6); // Sunday: 0, Saturday: 6
  
  if (isWeekend) {
    return { isSuspicious: true, fraudReason: 'Expense submitted on a weekend. Policy requires review.' };
  }
  
  if (amount > 3000) {
    return { isSuspicious: true, fraudReason: 'Unusually high amount for standard operational expenses.' };
  }

  return { isSuspicious: false, fraudReason: null };
};

/**
 * Simulates AI Smart Approval Suggestion
 */
exports.getSmartSuggestion = (amount, category) => {
  if (amount < 100 && ['Food', 'Travel', 'Office Supplies'].includes(category)) {
    return { suggestion: 'APPROVE', suggestionReason: 'Low-value amount in a standard pre-approved category.' };
  }
  if (amount > 1000) {
    return { suggestion: 'REVIEW', suggestionReason: 'High value expense triggers mandatory manual review protocol.' };
  }
  return { suggestion: 'REVIEW', suggestionReason: 'Standard procedure review.' };
};

/**
 * Simulates AI Expense Story Generator
 */
exports.generateExpenseStory = (amount, currency, category, dateString) => {
  return `This appears to be a valid business expense of ${amount} ${currency} for ${category} incurred on ${dateString.split('T')[0]}.`;
};

/**
 * Simulates AI Mood/Tone Detection from Description
 */
exports.detectMood = (description) => {
  const informalWords = ['party', 'fun', 'chill', 'drinks', 'beers', 'club', 'hangout'];
  const descLower = description.toLowerCase();
  
  const hasInformal = informalWords.some(word => descLower.includes(word));
  return { moodWarning: hasInformal };
};

/**
 * Aggregates all AI Insights for an Expense
 */
exports.analyzeExpense = (amount, currency, dateString, category, description) => {
  const fraud = exports.detectFraud(amount, dateString, category);
  const suggestion = exports.getSmartSuggestion(amount, category);
  const story = exports.generateExpenseStory(amount, currency, category, dateString);
  const mood = exports.detectMood(description);

  return {
    isSuspicious: fraud.isSuspicious,
    fraudReason: fraud.fraudReason,
    smartSuggestion: suggestion.suggestion,
    suggestionReason: suggestion.suggestionReason,
    story: story,
    moodWarning: mood.moodWarning
  };
};
