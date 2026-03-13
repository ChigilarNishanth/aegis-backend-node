const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. GLOBAL MIDDLEWARE (Must be before routes!)
app.use(express.json());
app.use(cors());

// 2. IMPORT THE ROUTE FILES
const patientRoutes = require('./routes/patients');
const authRoutes = require('./routes/auth');
const recordRoutes = require('./routes/records');

// 3. MOUNT THE ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/patients', patientRoutes); // This enables /api/patients/add

// 4. DATABASE & SERVER START
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        // Add this to server.js
app.get('/', (req, res) => {
    res.send('<h1>Aegis-Health Link API: Systems Online</h1><p>The decentralized hashing engine and medical registry are active.</p>');
});
    })

    .catch(err => console.log(err));
