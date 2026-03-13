const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: String, required: true },
    specialization: { type: String, required: true }, // Qualification/Specialization
    employeeId: { type: String, required: true, unique: true }, // Hospital Employee ID
    hospital: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'doctor' }
});

module.exports = mongoose.model('Doctor', DoctorSchema);