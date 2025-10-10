// src/components/StockDetailsModal.jsx

import React from 'react';
import './StockDetailsModal.css'; // We'll create this file next

function StockDetailsModal({ data, onClose }) {
  if (!data) return null;

  const { profile, trends } = data;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <img src={profile.logo} alt={`${profile.name} logo`} className="company-logo" />
          <div>
            <h2>{profile.name} ({profile.ticker})</h2>
            <p>{profile.finnhubIndustry}</p>
          </div>
        </div>
        <div className="modal-body">
          <h3>Analyst Recommendation Trends</h3>
          {trends ? (
            <div className="trends-container">
              <div className="trend-item"><strong>Strong Buy:</strong> {trends.strongBuy}</div>
              <div className="trend-item"><strong>Buy:</strong> {trends.buy}</div>
              <div className="trend-item"><strong>Hold:</strong> {trends.hold}</div>
              <div className="trend-item"><strong>Sell:</strong> {trends.sell}</div>
              <div className="trend-item"><strong>Strong Sell:</strong> {trends.strongSell}</div>
            </div>
          ) : <p>No trend data available.</p>}
        </div>
      </div>
    </div>
  );
}

export default StockDetailsModal;