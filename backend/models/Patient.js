const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be positive'],
    max: [120, 'Age must be realistic']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Resolved', 'Chronic'],
      default: 'Active'
    }
  }],
  symptoms: [{
    description: String,
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe'],
      default: 'Mild'
    },
    duration: String,
    recordedAt: {
      type: Date,
      default: Date.now
    }
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);

