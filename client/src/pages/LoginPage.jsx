// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './RegisterPage.css'; // We can reuse the same CSS!

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = 'http://localhost:5001/api/auth/login';
      const userData = { username, password };
      const response = await axios.post(url, userData);

      // Save the token from the response to localStorage
      localStorage.setItem('token', response.data.token);

      toast.success(`Welcome back, ${username}! Redirecting to your dashboard...`, {
        duration: 3000,
        icon: '👋',
      });

      // Redirect to the dashboard page
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    }
  };

  return (
    <div className="form-container">
      <div className="form-container-inner">
        <div className="form-welcome">
          <h2>Welcome Back!</h2>
          <p>Sign in to access your portfolio and track your investments.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Login</h1>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-button">
            Sign In
          </button>

          <div className="form-footer">
            Don't have an account? <Link to="/register">Create one here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;