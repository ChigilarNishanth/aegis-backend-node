const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // The token usually comes in the 'Authorization' header as 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the doctor's info to the request so we can use it later
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// This ensures only those with 'doctor' role can access specific functions
const isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Only licensed doctors can perform this action' });
    }
};

module.exports = { protect, isDoctor };