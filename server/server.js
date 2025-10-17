// server/server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Route Files
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const stockApiRoutes = require('./routes/stocks'); 
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://siddhigalada44.github.io'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Tracker API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stocks', stockApiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});