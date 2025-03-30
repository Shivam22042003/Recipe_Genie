import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    // State to check if user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Simulating user login state (Replace this with actual authentication logic)
    useEffect(() => {
        const user = localStorage.getItem("user"); // Assuming user info is stored in localStorage
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("user"); // Clear user data
        setIsLoggedIn(false);
        window.location.href = "/"; // Redirect to home
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">RecipeGenie</Link>

            <div className="navbar-links">
                <Link to="/">Home</Link>
                
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/feed">Feed</Link>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
