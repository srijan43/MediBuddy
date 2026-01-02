const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Generate JWT token
const generateToken = (userId, userType) => {
  return jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: '7d' });
};

// Patient Registration
router.post('/register/patient', async (req, res) => {
  try {
    const { username, email, password, age, gender } = req.body;

    // Check if user already exists
    const existingPatient = await Patient.findOne({ $or: [{ email }, { username }] });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient already exists with this email or username' });
    }

    const patient = new Patient({
      username,
      email,
      password,
      age,
      gender
    });

    await patient.save();

    const token = generateToken(patient._id, 'patient');

    res.status(201).json({
      message: 'Patient registered successfully',
      token,
      user: {
        id: patient._id,
        username: patient.username,
        email: patient.email,
        age: patient.age,
        gender: patient.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctor Registration
router.post('/register/doctor', async (req, res) => {
  try {
    const { username, email, password, fullName, specialization, experience, consultationFee, availability } = req.body;

    const existingDoctor = await Doctor.findOne({ $or: [{ email }, { username }] });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor already exists with this email or username' });
    }

    const doctor = new Doctor({
      username,
      email,
      password,
      fullName,
      specialization,
      experience,
      consultationFee,
      availability: availability || []
    });

    await doctor.save();

    const token = generateToken(doctor._id, 'doctor');

    res.status(201).json({
      message: 'Doctor registered successfully',
      token,
      user: {
        id: doctor._id,
        username: doctor.username,
        email: doctor.email,
        fullName: doctor.fullName,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Patient Login
router.post('/login/patient', async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(patient._id, 'patient');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: patient._id,
        username: patient.username,
        email: patient.email,
        age: patient.age,
        gender: patient.gender
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctor Login
router.post('/login/doctor', async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(doctor._id, 'doctor');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: doctor._id,
        username: doctor.username,
        email: doctor.email,
        fullName: doctor.fullName,
        specialization: doctor.specialization
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

