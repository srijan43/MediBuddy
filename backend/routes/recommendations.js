const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { authenticate } = require('../middleware/auth');

// Get personalized health recommendations
router.get('/personalized', authenticate, async (req, res) => {
  try {
    const patient = await Patient.findById(req.userId)
      .populate('appointments');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const recommendations = [];
    const insights = [];

    // Analyze recent symptoms
    const recentSymptoms = patient.symptoms.slice(-5);
    if (recentSymptoms.length > 0) {
      const severeSymptoms = recentSymptoms.filter(s => s.severity === 'Severe');
      if (severeSymptoms.length > 0) {
        recommendations.push({
          type: 'Urgent Care',
          title: 'Severe Symptoms Detected',
          description: 'You have reported severe symptoms. Consider scheduling an appointment with a specialist.',
          priority: 'High',
          action: 'Schedule Appointment'
        });
      }
    }

    // Medical history analysis
    const activeConditions = patient.medicalHistory.filter(m => m.status === 'Active');
    if (activeConditions.length > 0) {
      recommendations.push({
        type: 'Chronic Care',
        title: 'Active Medical Conditions',
        description: `You have ${activeConditions.length} active condition(s). Regular monitoring and follow-ups are recommended.`,
        priority: 'Medium',
        conditions: activeConditions.map(c => c.condition)
      });
    }

    // Appointment history insights
    const recentAppointments = patient.appointments.slice(-3);
    if (recentAppointments.length === 0) {
      recommendations.push({
        type: 'Preventive Care',
        title: 'Regular Check-up Recommended',
        description: 'Consider scheduling a routine health check-up to maintain your wellness.',
        priority: 'Low'
      });
    }

    // Age-based recommendations
    if (patient.age >= 50) {
      recommendations.push({
        type: 'Preventive Care',
        title: 'Age-Appropriate Screenings',
        description: 'Based on your age, consider regular screenings for blood pressure, cholesterol, and diabetes.',
        priority: 'Medium'
      });
    }

    // General wellness recommendations
    recommendations.push({
      type: 'Lifestyle',
      title: 'Maintain Healthy Habits',
      description: 'Regular exercise, balanced diet, adequate sleep, and stress management contribute to overall health.',
      priority: 'Low'
    });

    // Health insights
    insights.push({
      metric: 'Total Symptoms Recorded',
      value: patient.symptoms.length,
      trend: patient.symptoms.length > 0 ? 'Active' : 'None'
    });

    insights.push({
      metric: 'Active Conditions',
      value: activeConditions.length,
      trend: activeConditions.length > 0 ? 'Requires Attention' : 'None'
    });

    insights.push({
      metric: 'Total Appointments',
      value: patient.appointments.length,
      trend: 'Historical'
    });

    res.json({
      recommendations,
      insights,
      patientSummary: {
        age: patient.age,
        gender: patient.gender,
        totalSymptoms: patient.symptoms.length,
        activeConditions: activeConditions.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specialist recommendations based on symptoms
router.post('/specialists', authenticate, async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ message: 'Symptoms array is required' });
    }

    const symptomText = symptoms.map(s => s.description || s).join(' ').toLowerCase();

    const specialtyMapping = {
      'cardiology': ['chest pain', 'heart', 'palpitations', 'shortness of breath', 'dizziness', 'blood pressure'],
      'neurology': ['headache', 'seizure', 'numbness', 'tingling', 'memory loss', 'confusion', 'migraine'],
      'dermatology': ['rash', 'itching', 'skin', 'acne', 'lesion', 'mole', 'dermatitis'],
      'gastroenterology': ['stomach', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal pain', 'digestion'],
      'pulmonology': ['cough', 'breathing', 'wheezing', 'asthma', 'chest tightness', 'lung'],
      'orthopedics': ['joint pain', 'back pain', 'fracture', 'swelling', 'stiffness', 'bone'],
      'endocrinology': ['diabetes', 'thyroid', 'fatigue', 'weight', 'hormone', 'metabolism'],
      'psychiatry': ['anxiety', 'depression', 'stress', 'mood', 'sleep', 'mental health']
    };

    const matchedSpecialties = [];
    Object.keys(specialtyMapping).forEach(specialty => {
      const matches = specialtyMapping[specialty].filter(keyword => 
        symptomText.includes(keyword)
      );
      if (matches.length > 0) {
        matchedSpecialties.push({
          specialty: specialty.charAt(0).toUpperCase() + specialty.slice(1),
          confidence: Math.min(matches.length * 0.25, 0.95),
          matchedKeywords: matches
        });
      }
    });

    // Sort by confidence
    matchedSpecialties.sort((a, b) => b.confidence - a.confidence);

    // Get doctors for recommended specialties
    const specialtyNames = matchedSpecialties.map(s => s.specialty);
    const doctors = await Doctor.find({
      specialization: { $in: specialtyNames }
    })
    .select('-password')
    .sort({ rating: -1, experience: -1 })
    .limit(10);

    res.json({
      recommendedSpecialties: matchedSpecialties,
      recommendedDoctors: doctors,
      analysis: {
        totalSymptoms: symptoms.length,
        matchedSpecialties: matchedSpecialties.length,
        topRecommendation: matchedSpecialties[0] || null
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

