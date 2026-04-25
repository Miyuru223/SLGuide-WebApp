const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const router = express.Router();
router.use('/auth', require('./routes/auth'));
router.use('/destinations', require('./routes/destinations'));
router.use('/hotels', require('./routes/hotels'));

app.use('/api', router);
app.use('/.netlify/functions/api', router); // For Netlify serverless

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/slguide')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Only start the server locally, not in Netlify serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export the app for Vercel/Netlify serverless functions
module.exports = app;

// backend - npm run dev
//frontend - npm start