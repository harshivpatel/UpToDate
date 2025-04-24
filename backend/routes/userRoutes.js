const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// ✅ Login
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

// ✅ Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// ✅ Me (Session-based)
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.status(200).json({ userName: req.session.user.userName });
});

// ✅ Delete User
router.delete('/delete/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    if (!userName) return res.status(400).json({ error: 'Username is required' });

    const deletedUser = await User.findOneAndDelete({ userName });
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (err) {
    console.error('Error deleting the user', err);
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});

module.exports = router;
