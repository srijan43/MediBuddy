const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user is patient or doctor
    let user = await Patient.findById(decoded.userId);
    if (!user) {
      user = await Doctor.findById(decoded.userId);
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { authenticate };

