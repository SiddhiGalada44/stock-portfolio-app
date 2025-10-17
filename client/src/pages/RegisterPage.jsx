// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = 'http://localhost:5001/api/auth/register';
      const userData = { username, password };
      const response = await axios.post(url, userData);

      toast.success('Registration successful! Please login to continue.', {
        duration: 4000,
      });

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="form-container">
      <div className="form-container-inner">
        <div className="form-welcome">
          <h2>Create Your Account</h2>
          <p>Join Portfolio Tracker to manage your investments and track your financial growth in real-time.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Register</h1>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Choose a username"
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
              placeholder="Create a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="form-button">
            Create Account
          </button>

          <div className="form-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;