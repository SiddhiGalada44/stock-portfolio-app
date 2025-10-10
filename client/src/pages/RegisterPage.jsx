// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import axios from 'axios'; // Make sure you've run 'npm install axios'
import './RegisterPage.css';
function RegisterPage() {
  // Create state variables to hold the username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // This function will be called when the form is submitted
  const handleSubmit = async (event) => {
    // Prevent the default form submission behavior (which reloads the page)
    event.preventDefault();

    try {
      // The API endpoint for registration on your backend
      const url = 'http://localhost:5001/api/auth/register'; // Use port 5001 if you changed it

      // The data we want to send, matching the backend's expectations
      const userData = { username, password };

      // Make the POST request using axios
      const response = await axios.post(url, userData);

      // Handle the response from the server
      toast.success('Registration successful!');  // Show a success message
      // You could also redirect the user to the login page here

    } catch (error) {
      // Handle any errors that occur during the request
      const message = error.response?.data?.message || 'Registration failed.';
      toast.error(message); // <-- 2. Replace alert()
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Register</h1>
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
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;