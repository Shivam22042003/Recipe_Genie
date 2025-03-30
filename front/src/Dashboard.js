import React, { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import "./Dashboard.css";

// Pie Chart Data
const pieData = [
    { name: "Completed", value: 75 },
    { name: "In Progress", value: 25 },
];
const COLORS = ["#0088FE", "#00C49F"];

// Line Chart Data
const lineData = [
    { name: "01", value: 44 },
    { name: "05", value: 46 },
    { name: "09", value: 48 },
    { name: "13", value: 45 },
    { name: "17", value: 46 },
    { name: "21", value: 47 },
    { name: "26", value: 48 },
    { name: "31", value: 49 },
];

function Dashboard() {
    const [profileImage, setProfileImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: "John Doe",
        age: "30",
        diet: "Vegan",
        allergies: "Nuts, Dairy",
        gymPreference: "Yes",
        medicalConditions: "None",
        totalRecipes: "20",
    });

    // Handle Image Upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Toggle Edit Mode
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    // Handle Input Change
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar - Profile Section */}
            <div className="sidebar">
                <h2>Profile</h2>

                {/* Profile Image Upload */}
                <div className="profile-image">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" className="user-img" />
                    ) : (
                        <label className="upload-placeholder">
                            Upload Image
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    )}
                </div>

                {/* Profile Info (Editable) */}
                <div className="profile-info">
                    {isEditing ? (
                        <>
                            <input type="text" name="name" value={userData.name} onChange={handleChange} />
                            <input type="text" name="age" value={userData.age} onChange={handleChange} />
                            <input type="text" name="diet" value={userData.diet} onChange={handleChange} />
                            <input type="text" name="allergies" value={userData.allergies} onChange={handleChange} />
                            <input type="text" name="gymPreference" value={userData.gymPreference} onChange={handleChange} />
                            <input type="text" name="medicalConditions" value={userData.medicalConditions} onChange={handleChange} />
                        </>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {userData.name}</p>
                            <p><strong>Age:</strong> {userData.age}</p>
                            <p><strong>Diet:</strong> {userData.diet}</p>
                            <p><strong>Allergies:</strong> {userData.allergies}</p>
                            <p><strong>Gym:</strong> {userData.gymPreference}</p>
                            <p><strong>Medical:</strong> {userData.medicalConditions}</p>
                        </>
                    )}
                </div>

                {/* Edit Button */}
                <button className="edit-btn" onClick={handleEditClick}>
                    {isEditing ? "Save" : "Edit Profile"}
                </button>
            </div>

            {/* Dashboard Content */}
            <div className="content">
                <h2>Dashboard</h2>

                {/* Two Divs for Analysis */}
                <div className="analysis-section">
                    {/* Goal Overview Chart */}
                    <div className="chart-box">
                        <h3>Goal Overview</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Progress Line Chart */}
                    <div className="chart-box">
                        <h3>Progress</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[40, 50]} /> {/* Adjusted scale */}
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
