// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css'; // We can reuse the same CSS!

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const url = 'http://localhost:5001/api/auth/login';
      const userData = { username, password };
      const response = await axios.post(url, userData);

      // IMPORTANT: Save the token from the response to localStorage
      localStorage.setItem('token', response.data.token);

       toast.success('Login successful!');
      // TODO: Redirect to the dashboard page
      // window.location.href = '/'; 

    } catch (error) {
    //   console.error('Login failed:', error.response?.data?.message || error.message);
    //   alert(error.response?.data?.message || 'Login failed. Please try again.');
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message); // <-- 2. Replace alert()
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="form-input"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;