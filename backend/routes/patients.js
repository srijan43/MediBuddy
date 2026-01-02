const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { authenticate } = require('../middleware/auth');

// Get patient profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId)
      .populate('appointments')
      .select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update patient profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { age, gender, medicalHistory } = req.body;
    
    const patient = await Patient.findById(req.userId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (medicalHistory) patient.medicalHistory = medicalHistory;

    patient.updatedAt = Date.now();
    await patient.save();

    res.json({ message: 'Profile updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add symptom
router.post('/symptoms', authenticate, async (req, res) => {
  try {
    const { description, severity, duration } = req.body;

    const patient = await Patient.findById(req.userId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.symptoms.push({
      description,
      severity: severity || 'Mild',
      duration
    });

    await patient.save();

    res.json({ message: 'Symptom recorded successfully', symptoms: patient.symptoms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient symptoms
router.get('/symptoms', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ symptoms: patient.symptoms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add medical history
router.post('/medical-history', authenticate, async (req, res) => {
  try {
    const { condition, diagnosisDate, status } = req.body;

    const patient = await Patient.findById(req.userId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    patient.medicalHistory.push({
      condition,
      diagnosisDate: diagnosisDate || Date.now(),
      status: status || 'Active'
    });

    await patient.save();

    res.json({ message: 'Medical history added successfully', medicalHistory: patient.medicalHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

