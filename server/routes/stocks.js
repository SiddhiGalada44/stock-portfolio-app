// server/routes/stocks.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

// Endpoint for symbol autocomplete search
// Ex: GET /api/stocks/search?q=AAPL
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Query parameter "q" is required.' });
  }
  try {
    const url = `${BASE_URL}/search?q=${query}&token=${FINNHUB_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Finnhub search error:', error);
    res.status(500).json({ message: 'Error fetching data from Finnhub.' });
  }
});

// Endpoint for getting company details and trends
// Ex: GET /api/stocks/details/AAPL
router.get('/details/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  try {
    // Fetch company profile and recommendation trends in parallel
    const profileUrl = `${BASE_URL}/stock/profile2?symbol=${ticker}&token=${FINNHUB_API_KEY}`;
    const trendsUrl = `${BASE_URL}/stock/recommendation?symbol=${ticker}&token=${FINNHUB_API_KEY}`;

    const [profileResponse, trendsResponse] = await Promise.all([
      axios.get(profileUrl),
      axios.get(trendsUrl),
    ]);

    // Combine the relevant data into a single object
    const combinedData = {
      profile: profileResponse.data,
      trends: trendsResponse.data[0], // Trends data is an array, we want the first element
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Finnhub details error:', error);
    res.status(500).json({ message: 'Error fetching details from Finnhub.' });
  }
});

module.exports = router;