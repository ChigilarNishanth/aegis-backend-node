const express = require('express');
const router = express.Router(); // This line was missing!
const Record = require('../models/Record');

// @route   POST /api/records/verify
// @desc    Verify hash and return hospital audit log
router.post('/verify', async (req, res) => {
    try {
        const { patientHash, attributeHash } = req.body;

        // Use .find() to get ALL reports from ALL hospitals
        const matchingRecords = await Record.find({ patientHash, attributeHash });

        if (matchingRecords.length > 0) {
            return res.json({
                verified: true,
                reports: matchingRecords.map(r => ({
                    hospital: r.hospital || "General Facility",
                    doctor: r.verifiedBy || "Medical Staff",
                    date: r.timestamp
                }))
            });
        }
        res.json({ verified: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Audit retrieval failed" });
    }
});

// @route   POST /api/records/add
// @desc    Add a new decentralized record
router.post('/add', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json({ message: "Record secured successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save record" });
    }
});

module.exports = router; // Must export the router at the end