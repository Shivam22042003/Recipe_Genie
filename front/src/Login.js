import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    console.log(`Updating ${e.target.name} to ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const res = await axios.post("http://localhost:5000/api/login", formData);
      console.log("Token from backend:", res.data.token);
      localStorage.setItem("token", res.data.token); 

      setMessage(res.data.message);

      navigate("/home");
    } catch (err) {
      console.log("Login error:", err.response?.data);
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Log in to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
      <div className="login-animation">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
    </div>
  );
};

export default Login;
