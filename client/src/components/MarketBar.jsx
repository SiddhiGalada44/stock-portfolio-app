// src/components/MarketBar.jsx

import React, { useState, useEffect } from 'react';
import './MarketBar.css';

// IMPORTANT: Replace with your actual Finnhub API key
const FINNHUB_API_KEY = 'd3e2tppr01qrd38sloj0d3e2tppr01qrd38slojg'; 

// Define the symbols you want to track. You can customize this list.
const symbolsToTrack = [
  { symbol: 'BINANCE:BTCUSDT', name: 'BTC/USD' },
  { symbol: 'BINANCE:ETHUSDT', name: 'ETH/USD' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'GOOGL', name: 'Alphabet' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'META', name: 'Meta' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'V', name: 'Visa' },
    { symbol: 'DIS', name: 'Disney' },
    { symbol: 'NFLX', name: 'Netflix' },
    { symbol: 'PYPL', name: 'PayPal' },
    { symbol: 'ADBE', name: 'Adobe' },
    { symbol: 'INTC', name: 'Intel' },
    { symbol: 'CSCO', name: 'Cisco' },
    { symbol: 'ORCL', name: 'Oracle' },
    { symbol: 'CRM', name: 'Salesforce' },
    { symbol: 'IBM', name: 'IBM' },
    { symbol: 'BA', name: 'Boeing' },
    { symbol: 'GE', name: 'General Electric' },
];

function MarketBar() {
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    // Create a new WebSocket connection
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);

    // 1. Connection opened
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established.');
      symbolsToTrack.forEach(item => {
        socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': item.symbol }));
      });
    });

    // 2. Listen for messages (live price updates)
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'trade' && message.data) {
        // Update the state with the latest price for each symbol
        setMarketData(prevData => {
          const newData = { ...prevData };
          message.data.forEach(trade => {
            newData[trade.s] = { price: trade.p };
          });
          return newData;
        });
      }
    });

    // 3. Clean up the connection when the component is unmounted
    return () => {
      console.log('WebSocket connection closed.');
      socket.close();
    };
  }, []); // The empty array ensures this effect runs only once

  return (
    <div className="market-bar">
      {symbolsToTrack.map(item => (
        <div key={item.symbol} className="ticker-item">
          <span className="ticker-name">{item.name}</span>
          <span className="ticker-price">
            {marketData[item.symbol] 
              ? marketData[item.symbol].price.toFixed(2) 
              : 'Loading...'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default MarketBar;