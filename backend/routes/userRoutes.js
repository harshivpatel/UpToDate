const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register a new User
router.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Ensure that all fields are provided
        if (!userName || !email || !password) {
            return res.status(400).json({ error: 'All fields (username, email & password) are required' });
        }

        // Trim the password to avoid extra spaces causing issues
        const trimmedPassword = password.trim();

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user instance with the raw (unhashed) password
        const user = new User({ userName, email, password: trimmedPassword });

        // Save the user (password will be hashed in the pre-save hook)
        await user.save();

        // Respond with a success message
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        console.error('Error registering the user:', err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});


// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ error: 'Email and password are required '});
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ error:'Invalid password'});
        }
        res.status(200).json({ message: 'Login successfully', user });
    } catch (err) {
        console.log('Error during login:', err);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

module.exports = router;