// src/components/RecommendationBar.jsx
import React from 'react';
import './RecommendationBar.css';

function RecommendationBar({ trends }) {
  if (!trends) return null;

  const { strongBuy, buy, hold, sell, strongSell } = trends;
  const total = strongBuy + buy + hold + sell + strongSell;

  const buyPercentage = ((strongBuy + buy) / total) * 100;
  const holdPercentage = (hold / total) * 100;
  const sellPercentage = ((sell + strongSell) / total) * 100;

  return (
    <div className="recommendation-bar">
      <div className="bar-segment buy" style={{ width: `${buyPercentage}%` }} title={`Buy: ${strongBuy + buy}`}></div>
      <div className="bar-segment hold" style={{ width: `${holdPercentage}%` }} title={`Hold: ${hold}`}></div>
      <div className="bar-segment sell" style={{ width: `${sellPercentage}%` }} title={`Sell: ${sell + strongSell}`}></div>
    </div>
  );
}
export default RecommendationBar;