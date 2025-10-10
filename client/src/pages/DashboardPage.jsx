// src/pages/DashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import StockDetailsModal from '../components/StockDetailsModal';
import RecommendationBar from '../components/RecommendationBar'; // 1. Import the new RecommendationBar component
import './DashboardPage.css';

// A simple debounce function to prevent API calls on every keystroke
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

function DashboardPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  // 2. New state for the purchase date input
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [modalData, setModalData] = useState(null);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      const response = await axios.get('http://localhost:5001/api/portfolio', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const portfolioData = response.data;
      setPortfolio(portfolioData);

      const total = portfolioData.reduce((acc, stock) => acc + stock.totalValue, 0);
      setTotalValue(total);
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      toast.error('Could not fetch portfolio.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleAddStock = async (event) => {
    event.preventDefault();
    setSearchResults([]);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/api/portfolio', 
        { 
          ticker: ticker.toUpperCase(), 
          shares: Number(shares),
          purchaseDate: purchaseDate, // 3. Add purchaseDate to the request body
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success(`${ticker.toUpperCase()} added to portfolio!`);
      fetchPortfolio();
      setTicker('');
      setShares('');
      setPurchaseDate(new Date().toISOString().split('T')[0]); // 4. Reset date field after adding
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add stock.';
      toast.error(message);
    }
  };

  const handleDeleteStock = async (stockId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/portfolio/${stockId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Stock removed from portfolio.');
      fetchPortfolio();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete stock.';
      toast.error(message);
    }
  };

  const searchStocks = async (query) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5001/api/stocks/search?q=${query}`);
      setSearchResults(response.data.result.filter(item => !item.symbol.includes('.')));
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const debouncedSearch = useCallback(debounce(searchStocks, 300), []);

  const handleTickerChange = (e) => {
    const query = e.target.value.toUpperCase();
    setTicker(query);
    debouncedSearch(query);
  };

  const handleSuggestionClick = (symbol) => {
    setTicker(symbol);
    setSearchResults([]);
  };
  
  const handleViewDetails = async (ticker) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/stocks/details/${ticker}`);
      setModalData(response.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Could not fetch company details.';
      toast.error(message);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <div className="portfolio-summary">
        <h2>Total Portfolio Value</h2>
        <p className="total-value">{formatCurrency(totalValue)}</p>
      </div>

      <div className="add-stock-form">
        <h2>Add a New Stock</h2>
        <form onSubmit={handleAddStock} className="form-autocomplete-container">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ticker">Ticker Symbol</label>
              <input 
                id="ticker" type="text" className="form-input"
                value={ticker} onChange={handleTickerChange}
                autoComplete="off" required
              />
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.slice(0, 7).map(item => (
                    <li key={item.symbol} onClick={() => handleSuggestionClick(item.symbol)}>
                      <strong>{item.symbol}</strong> - {item.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="shares">Number of Shares</label>
              <input
                id="shares" type="number" className="form-input"
                value={shares} onChange={(e) => setShares(e.target.value)}
                required
              />
            </div>
            {/* 5. New input field for Purchase Date */}
            <div className="form-group">
              <label htmlFor="purchaseDate">Purchase Date</label>
              <input
                id="purchaseDate" type="date" className="form-input"
                value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="form-button">Add Stock</button>
          </div>
        </form>
      </div>

      <div className="portfolio-list">
        <h2>Your Portfolio</h2>
        {isLoading ? (
          <p>Loading portfolio...</p>
        ) : (
          portfolio.map(stock => (
            <div key={stock._id} className="stock-item">
              <div className="stock-info">
                <span className="stock-ticker">{stock.ticker}</span>
                {/* 6. Display the purchase date */}
                <span>Purchased: {new Date(stock.purchaseDate).toLocaleDateString()}</span>
              </div>
              <div className="stock-value">
                <span>{formatCurrency(stock.currentPrice)} / share</span>
                <span className="total-value">{formatCurrency(stock.totalValue)}</span>
              </div>
              <div className="stock-trends">
                {/* 7. Display the analyst recommendations bar */}
                <RecommendationBar trends={stock.trends} />
              </div>
              <div className="stock-actions">
                 <button type="button" className="details-button" onClick={() => handleViewDetails(stock.ticker)}>Details</button>
                 <button type="button" className="delete-button" onClick={() => handleDeleteStock(stock._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {modalData && <StockDetailsModal data={modalData} onClose={() => setModalData(null)} />}
    </div>
  );
}

export default DashboardPage;