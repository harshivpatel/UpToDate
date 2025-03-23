const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register a new User
router.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({ error: 'All fields (username, email & password) are required' });
        }

        const trimmedPassword = password.trim();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        console.log('Hashed Password:', hashedPassword);
        
        const user = new User({ userName, email, password: hashedPassword });

        await user.save();

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
            return res.status(404).json({ error: 'User not found with this Email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ error:'Wrong password'});
        }

        res.status(200).json({ message: 'Login successfully', user });
    } catch (err) {
        console.log('Error during login:', err);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});


// Delete a user
router.delete('/delete/:userName', async (req, res) => {
    try {
        const { userName } = req.params;

        if (!userName) {
            return res.status(400).json({ error: 'Username is required to delete your account'})
        }

        const deletedUser = await User.findOneAndDelete({ userName });

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
        console.error('Error deleting the user', err);
        res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
});

module.exports = router;