const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    patientId: { type: String, required: true, unique: true }, // The ID the doctor types
    name: { type: String, required: true },
    dob: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', PatientSchema);