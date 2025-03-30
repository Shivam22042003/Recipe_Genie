const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = 'your_secret_key';

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user: { name, email } });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
