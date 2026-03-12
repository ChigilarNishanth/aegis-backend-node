const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const router = express.Router();

// REGISTER DOCTOR
router.post('/register', async (req, res) => {
    try {
        const { name, dob, specialization, employeeId, hospital, email, password } = req.body;

        // Check if doctor already exists
        const existingDoc = await Doctor.findOne({ $or: [{ email }, { employeeId }] });
        if (existingDoc) return res.status(400).json({ message: "Employee ID or Email already registered." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDoctor = new Doctor({
            name, dob, specialization, employeeId, hospital, email, password: hashedPassword
        });

        await newDoctor.save();
        res.status(201).json({ message: "Clinician profile created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN DOCTOR
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor.findOne({ email });
        if (!doctor) return res.status(400).json({ message: "Doctor not found" });

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT Token
        const token = jwt.sign(
            { id: doctor._id, role: doctor.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, doctor: { name: doctor.name, hospital: doctor.hospital } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;