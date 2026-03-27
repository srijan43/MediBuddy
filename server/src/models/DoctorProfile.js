const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], required: true },
    slots: [{ type: String }],
  },
  { _id: false }
);

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true, index: true },
    specialization: { type: String, required: true, index: true },
    bio: { type: String, default: '' },
    clinic: { type: String, default: '' },
    city: { type: String, default: '' },
    availability: [availabilitySchema],
    acceptingNewPatients: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doctorProfileSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);

module.exports = { DoctorProfile };

