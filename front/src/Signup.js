import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Ensure this file exists

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    console.log(`Updating ${e.target.name} to ${e.target.value}`); // Debugging
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log('Signup response:', res.data); // Debugging
      setMessage(res.data.message); // Show success message
      setError(''); // Clear error if successful
    } catch (err) {
      console.error('Signup error:', err.response?.data); // Debugging
      setError(err.response?.data?.error || 'Something went wrong'); // Handle backend error
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <h2>Create an Account</h2>
          <p>Join us to access amazing features</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange} // Updates state
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange} // Updates state
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange} // Updates state
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange} // Updates state
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
      <div className="signup-animation">
        <div className="triangle triangle1"></div>
        <div className="triangle triangle2"></div>
        <div className="triangle triangle3"></div>
      </div>
    </div>
  );
};

export default Signup;
