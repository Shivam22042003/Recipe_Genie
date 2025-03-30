// Import Required Modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json({ limit: "50mb" })); // Allow large payloads for images

// ✅ Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/user-auth";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// --------------------------------------
// ✅ Gemini Text Generation Route
// --------------------------------------
app.post("/api/generate-text", async (req, res) => {
  const { prompt, image } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

    const requestPayload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    if (image) {
      requestPayload.contents[0].parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image,
        },
      });
    }

    const response = await axios.post(apiUrl, requestPayload);

    res.json(response.data);
  } catch (error) {
    console.error("Gemini Text API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch text data from Gemini API" });
  }
});

// --------------------------------------
// ✅ Gemini Image Generation Route (Note: Gemini currently doesn't directly generate images. 
// Instead, Gemini processes images for content generation. 
// You might consider using another service like DALL-E or Stable Diffusion for image generation.)
// --------------------------------------
app.post("/api/generate-image", async (req, res) => {
  res.status(501).json({ error: "Gemini doesn't currently support direct image generation." });
});

// --------------------------------------
// ✅ User Signup Route
// --------------------------------------
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully", user: { name, email } });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------------
// ✅ User Login Route
// --------------------------------------
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------------------------
// ✅ Protected Home Route
// --------------------------------------
app.get("/api/home", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: `Welcome ${decoded.name}`, user: decoded });
  } catch (err) {
    return res.status(401).json({ error: err.name === "TokenExpiredError" ? "Token expired" : "Unauthorized" });
  }
});

// --------------------------------------
// ✅ Server Start
// --------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


//hi this is me nilesh pal

