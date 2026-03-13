const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hospital: { type: String, required: true }, // Crucial for Audit Log
    degree: { type: String },
    licenseNo: { type: String }
});

module.exports = mongoose.model('User', UserSchema);