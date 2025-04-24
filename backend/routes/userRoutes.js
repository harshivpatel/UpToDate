const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { ensureUserDataExists } = require('./userDataRoutes');

// Register
router.post('/register', async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    // Create UserData document
    await ensureUserDataExists(userName, newUser._id);

    // Save session
    req.session.user = {
      userName,
      id: newUser._id
    };

    res.status(201).json({ message: 'User registered successfully', userName });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = {
      userName: user.userName,
      id: user._id
    };

    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to save session' });
      }

      res.status(200).json({ userName: user.userName });
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Check current user
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({ userName: req.session.user.userName });
});

// Delete user
router.delete('/delete/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    if (!userName) return res.status(400).json({ error: 'Username is required' });

    const deletedUser = await User.findOneAndDelete({ userName });
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

module.exports = router;
