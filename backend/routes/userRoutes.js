const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../middleware/UserValidations");

/// Register a new User
router.post("/register", async (req, res) => {
    // Validate request data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { userName, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // **Hash password after validation**
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with hashed password
        const user = new User({ userName, email, password: hashedPassword });

        // Save the user to the database
        await user.save();
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        console.error("Error registering the user:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

// User login
router.post("/login", async (req, res) => {
    // Validate request data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found with this email" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Wrong password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

module.exports = router;
