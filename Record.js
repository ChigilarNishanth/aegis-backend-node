const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    patientHash: { type: String, required: true, index: true }, // The hashed ID
    attributeHash: { type: String, required: true }, // The hashed Allergy/NKDA
    recordType: { type: String, enum: ['ALLERGY', 'CLEARANCE'], required: true },
    label: { type: String }, // Optional: Plain text like "Penicillin" (Safe to store)
    verifiedBy: { type: String, required: true }, // Doctor's name or ID
    hospital: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);