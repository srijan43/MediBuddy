const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    type: String,
    required: [true, 'Diagnosis is required']
  },
  symptoms: [{
    description: String,
    severity: String,
    duration: String
  }],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number
  },
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    date: Date
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    startDate: Date,
    endDate: Date
  }],
  recommendations: [{
    type: String,
    description: String,
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    }
  }],
  followUpDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);

