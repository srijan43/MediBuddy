const { z } = require('zod');
const { User } = require('../models/User');
const { PatientProfile } = require('../models/PatientProfile');
const { DoctorProfile } = require('../models/DoctorProfile');
const { Appointment } = require('../models/Appointment');
const { Recommendation } = require('../models/Recommendation');

const updatePatientSchema = z.object({
  body: z.object({
    age: z.number().int().min(0).max(130).optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
    medicalHistory: z.string().max(5000).optional(),
    allergies: z.string().max(2000).optional(),
    currentMedications: z.string().max(2000).optional(),
  }),
});

const updateDoctorSchema = z.object({
  body: z.object({
    specialization: z.string().min(2).max(80).optional(),
    bio: z.string().max(5000).optional(),
    clinic: z.string().max(120).optional(),
    city: z.string().max(120).optional(),
    acceptingNewPatients: z.boolean().optional(),
  }),
});

async function getMe(req, res, next) {
  try {
    const userId = req.user.sub;
    const user = await User.findById(userId);
    if (!user) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });

    const profile =
      user.role === 'patient'
        ? await PatientProfile.findOne({ userId })
        : await DoctorProfile.findOne({ userId });

    res.json({ user: user.toJSON(), profile: profile?.toJSON() || null });
  } catch (err) {
    next(err);
  }
}

async function updateMyProfile(req, res, next) {
  try {
    const userId = req.user.sub;
    const user = await User.findById(userId);
    if (!user) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });

    if (user.role === 'patient') {
      const updated = await PatientProfile.findOneAndUpdate({ userId }, { $set: req.validated.body }, { new: true });
      return res.json({ profile: updated?.toJSON() || null });
    }

    const updated = await DoctorProfile.findOneAndUpdate({ userId }, { $set: req.validated.body }, { new: true });
    return res.json({ profile: updated?.toJSON() || null });
  } catch (err) {
    next(err);
  }
}

async function getMyAnalytics(req, res, next) {
  try {
    const userId = req.user.sub;
    const role = req.user.role;

    if (role === 'patient') {
      const [apptTotal, apptPending, recTotal] = await Promise.all([
        Appointment.countDocuments({ patientId: userId }),
        Appointment.countDocuments({ patientId: userId, status: 'pending' }),
        Recommendation.countDocuments({ patientId: userId }),
      ]);
      return res.json({ appointments: { total: apptTotal, pending: apptPending }, recommendations: { total: recTotal } });
    }

    const [apptTotal, apptPending] = await Promise.all([
      Appointment.countDocuments({ doctorId: userId }),
      Appointment.countDocuments({ doctorId: userId, status: 'pending' }),
    ]);
    return res.json({ appointments: { total: apptTotal, pending: apptPending } });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMyProfile, getMyAnalytics, updatePatientSchema, updateDoctorSchema };

