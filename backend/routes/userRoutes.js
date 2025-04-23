const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { registerValidation, loginValidation } = require("../middleware/UserValidations");
const { setSession } = require("../middleware/sessionHandler");

/// Register a new User
router.post("/register", async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { userName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ userName, email, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        console.error("Error registering the user:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

/// Login the user and use sessions (no JWT)
router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found with this email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Wrong password" });
        }

        // 🔁 Set session here instead of sending token
        setSession(req, user);

        res.status(200).json({
            message: "Login successful",
            session: req.session.user // Optional: you can omit this if you like
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

module.exports = router;
