const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { authenticate } = require('../middleware/auth');

// Symptom analysis algorithm
const analyzeSymptoms = (symptoms, medicalHistory, age, gender) => {
  const recommendations = [];
  const specialistReferrals = [];
  const priority = [];

  // Symptom-based analysis
  const symptomKeywords = {
    'cardiology': ['chest pain', 'heart', 'palpitations', 'shortness of breath', 'dizziness'],
    'neurology': ['headache', 'seizure', 'numbness', 'tingling', 'memory loss', 'confusion'],
    'dermatology': ['rash', 'itching', 'skin', 'acne', 'lesion', 'mole'],
    'gastroenterology': ['stomach', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain'],
    'pulmonology': ['cough', 'breathing', 'wheezing', 'asthma', 'chest tightness'],
    'orthopedics': ['joint pain', 'back pain', 'fracture', 'swelling', 'stiffness'],
    'endocrinology': ['diabetes', 'thyroid', 'fatigue', 'weight', 'hormone'],
    'psychiatry': ['anxiety', 'depression', 'stress', 'mood', 'sleep', 'mental']
  };

  const symptomText = symptoms.map(s => s.description.toLowerCase()).join(' ');
  
  // Determine likely specialists needed
  Object.keys(symptomKeywords).forEach(specialty => {
    const matches = symptomKeywords[specialty].filter(keyword => 
      symptomText.includes(keyword)
    );
    if (matches.length > 0) {
      specialistReferrals.push({
        specialty: specialty.charAt(0).toUpperCase() + specialty.slice(1),
        confidence: Math.min(matches.length * 0.3, 0.9),
        matchedKeywords: matches
      });
    }
  });

  // Generate recommendations based on symptoms
  if (symptomText.includes('fever') || symptomText.includes('temperature')) {
    recommendations.push({
      type: 'Immediate Care',
      description: 'Monitor your temperature regularly. If fever persists above 101°F for more than 3 days, seek immediate medical attention.',
      priority: 'High'
    });
  }

  if (symptomText.includes('chest pain') || symptomText.includes('heart')) {
    recommendations.push({
      type: 'Emergency',
      description: 'Chest pain can be serious. If severe or accompanied by shortness of breath, seek emergency care immediately.',
      priority: 'High'
    });
    priority.push('Cardiology');
  }

  if (symptomText.includes('breathing') || symptomText.includes('shortness')) {
    recommendations.push({
      type: 'Urgent Care',
      description: 'Difficulty breathing requires prompt medical evaluation. Avoid strenuous activities until assessed.',
      priority: 'High'
    });
    priority.push('Pulmonology');
  }

  // General health recommendations
  recommendations.push({
    type: 'Lifestyle',
    description: 'Maintain adequate hydration and rest. Avoid activities that worsen symptoms.',
    priority: 'Medium'
  });

  // Age and gender specific recommendations
  if (age > 50) {
    recommendations.push({
      type: 'Preventive Care',
      description: 'Given your age, consider regular health screenings and monitoring of vital signs.',
      priority: 'Medium'
    });
  }

  // Sort specialists by confidence
  specialistReferrals.sort((a, b) => b.confidence - a.confidence);

  return {
    recommendations,
    specialistReferrals: specialistReferrals.slice(0, 3), // Top 3 recommendations
    prioritySpecialties: [...new Set(priority)],
    severity: symptoms.some(s => s.severity === 'Severe') ? 'High' : 
              symptoms.some(s => s.severity === 'Moderate') ? 'Medium' : 'Low'
  };
};

// Analyze symptoms endpoint
router.post('/analyze', authenticate, async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Symptoms array is required' });
    }

    const patient = await Patient.findById(req.userId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Save symptoms to patient record
    symptoms.forEach(symptom => {
      patient.symptoms.push({
        description: symptom.description,
        severity: symptom.severity || 'Mild',
        duration: symptom.duration || 'Unknown'
      });
    });
    await patient.save();

    // Perform analysis
    const analysis = analyzeSymptoms(
      symptoms,
      patient.medicalHistory,
      patient.age,
      patient.gender
    );

    // Get recommended doctors
    const recommendedSpecialties = analysis.specialistReferrals.map(ref => ref.specialty);
    const doctors = await Doctor.find({
      specialization: { $in: recommendedSpecialties }
    })
    .select('-password')
    .sort({ rating: -1 })
    .limit(5);

    res.json({
      analysis,
      recommendedDoctors: doctors,
      patientSymptoms: patient.symptoms.slice(-symptoms.length)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get symptom analysis history
router.get('/history', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({
      symptoms: patient.symptoms,
      medicalHistory: patient.medicalHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

