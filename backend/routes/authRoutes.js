// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
    setSession,
    getSessionUser,
    destroySession,
    isAuthenticated
} = require('../middleware/sessionHandler');

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        setSession(req, user);
        res.send(`Welcome ${user.userName}, session started!`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Login error');
    }
});

// Dashboard (Protected Route)
router.get('/dashboard', isAuthenticated, (req, res) => {
    const user = getSessionUser(req);
    res.send(`Hello ${user.userName}, welcome to your dashboard.`);
});

// Logout
router.get('/logout', (req, res) => {
    destroySession(req, res);
});

module.exports = router;
