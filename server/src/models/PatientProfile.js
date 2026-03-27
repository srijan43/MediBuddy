const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true, index: true },
    age: { type: Number, min: 0, max: 130 },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
    medicalHistory: { type: String, default: '' },
    allergies: { type: String, default: '' },
    currentMedications: { type: String, default: '' },
    recentSymptoms: [{ type: String }],
  },
  { timestamps: true }
);

patientProfileSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);

module.exports = { PatientProfile };

