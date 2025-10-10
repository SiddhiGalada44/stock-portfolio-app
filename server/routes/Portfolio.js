// server/routes/portfolio.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const Stock = require('../models/Stock.js');
const axios = require('axios');

// GET USER'S PORTFOLIO (UPDATED with Recommendations)
router.get('/', auth, async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.user.id });

    const portfolioWithData = await Promise.all(
      stocks.map(async (stock) => {
        const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${stock.ticker}&token=${process.env.FINNHUB_API_KEY}`;
        const trendsUrl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${stock.ticker}&token=${process.env.FINNHUB_API_KEY}`;

        const [quoteResponse, trendsResponse] = await Promise.all([
          axios.get(quoteUrl),
          axios.get(trendsUrl),
        ]);
        
        const currentPrice = quoteResponse.data.c;
        const trends = trendsResponse.data[0]; // Get the most recent trend data

        return {
          _id: stock._id,
          ticker: stock.ticker,
          shares: stock.shares,
          purchaseDate: stock.purchaseDate, // Pass the date to the frontend
          currentPrice: currentPrice,
          totalValue: currentPrice * stock.shares,
          trends: trends, // Pass the trends to the frontend
        };
      })
    );
    
    res.json(portfolioWithData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ADD A STOCK TO PORTFOLIO (UPDATED with Purchase Date)
router.post('/', auth, async (req, res) => {
  try {
    const { ticker, shares, purchaseDate } = req.body; // Get date from request
    
    const newStock = new Stock({
      user: req.user.id,
      ticker: ticker.toUpperCase(),
      shares,
      purchaseDate, // Save the purchase date
    });

    await newStock.save();
    res.json(newStock);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE A STOCK (No changes needed here)
router.delete('/:id', auth, /* ... unchanged ... */ );

module.exports = router;