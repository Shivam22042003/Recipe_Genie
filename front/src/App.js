// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "./Home";
import RecipeDetails from "./RecipeDetails";
import Dashboard from "./Dashboard";
import Feed from "./Feed";
import Login from "./Login";
import Signup from "./Signup";
import "./App.css";
import logo from "./images/Logo.png"; // Ensure capitalization matches (Logo.png)


function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setUser(storedUser);
        }
    }, []);

    return (
        <Router>
            <MainApp user={user} setUser={setUser} />
        </Router>
    );
}

function MainApp({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="logo-container">
                <img src={logo} alt="RecipeGenie Logo" className="app-logo" />
                    <h1>RecipeGenie</h1>
                </div>
                <nav className="navbar">
                    <ul className="nav-links">
                        <li>
                            <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/feed" className={({ isActive }) => (isActive ? "active-link" : "")}>Feed</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active-link" : "")}>Dashboard</NavLink>
                        </li>
                        {user ? (
                            <li>
                                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/login" className={({ isActive }) => (isActive ? "active-link" : "")}>Login</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/signup" className={({ isActive }) => (isActive ? "active-link" : "")}>Signup</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/recipe-details" element={<RecipeDetails />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/signup" element={<Signup setUser={setUser} />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
