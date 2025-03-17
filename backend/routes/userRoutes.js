const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register a new User
router.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User( { userName, email, password : hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user});
    } catch (err) {
        console.error('Error registering the user:', err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords using the user instance method
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

module.exports = router;