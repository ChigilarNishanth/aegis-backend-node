const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure your User model has these fields
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, hospital, degree, licenseNo } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Doctor already registered" });

        // 2. Create New Doctor Profile
        user = new User({
            name,
            email,
            password, // Note: In production, use bcrypt to hash this!
            hospital,
            degree,
            licenseNo
        });

        await user.save();

        res.status(201).json({ message: "Clinician Profile Created Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Registration Failed: Server Error" });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // CRITICAL: Send the hospital name back so the Dashboard can use it
        res.json({
            token,
            doctor: {
                name: user.name,
                hospital: user.hospital
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Login Error" });
    }
});

module.exports = router;