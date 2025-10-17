import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import MarketBar from './MarketBar'; // 1. Import MarketBar

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    // 2. A new top-level container to hold everything
    <div className="app-container">
      
      {/* 3. The MarketBar component is placed here, at the top */}
      <MarketBar />

      {/* 4. The original layout-container is now inside */}
      <div className="layout-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Portfolio Tracker</h2>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/">Dashboard</NavLink>
          </nav>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </aside>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;