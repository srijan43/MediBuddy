const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { authenticate } = require('../middleware/auth');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specialization } = req.query;
    const query = specialization ? { specialization } : {};
    
    const doctors = await Doctor.find(query)
      .select('-password')
      .sort({ rating: -1 });
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-password')
      .populate('appointments');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor profile (authenticated)
router.get('/profile/me', authenticate, async (req, res) => {
  try {
    if (req.userType !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const doctor = await Doctor.findById(req.userId)
      .select('-password')
      .populate('appointments');
    
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update doctor profile
router.put('/profile/me', authenticate, async (req, res) => {
  try {
    if (req.userType !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const doctor = await Doctor.findById(req.userId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { fullName, specialization, experience, consultationFee, availability } = req.body;

    if (fullName) doctor.fullName = fullName;
    if (specialization) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (availability) doctor.availability = availability;

    await doctor.save();

    res.json({ message: 'Profile updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

