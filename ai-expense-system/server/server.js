const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (REAL database)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

connectDB();


// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Expense System API Running' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/expenses', require('./routes/expenses'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
