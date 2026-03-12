const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/patients/add
 * @desc    Register a new patient into the local hospital registry
 * @access  Private (Doctors Only)
 */
router.post('/add', protect, async (req, res) => {
    try {
        const { patientId, name, dob, bloodGroup, emergencyContact } = req.body;

        // Check if patient already exists in the system
        const existingPatient = await Patient.findOne({ patientId });
        if (existingPatient) {
            return res.status(400).json({ message: "Patient ID is already registered." });
        }

        const newPatient = new Patient({
            patientId,
            name,
            dob,
            bloodGroup,
            emergencyContact,
            addedBy: req.user.id // Captured from JWT token
        });

        await newPatient.save();
        res.status(201).json({ message: "Patient profile secured in registry." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error during patient registration.");
    }
});

/**
 * @route   GET /api/patients/:id
 * @desc    Fetch identity details for Triage Dashboard
 * @access  Private (Doctors Only)
 */
router.get('/:id', protect, async (req, res) => {
    try {
        // Find by the custom patientId string, not the MongoDB _id
        const patient = await Patient.findOne({ patientId: req.params.id });

        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }

        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error during identity fetch.");
    }
});

module.exports = router;