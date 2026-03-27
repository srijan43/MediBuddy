const { z } = require('zod');
const { Appointment } = require('../models/Appointment');
const { User } = require('../models/User');
const { DoctorProfile } = require('../models/DoctorProfile');

const bookAppointmentSchema = z.object({
  body: z.object({
    doctorProfileId: z.string().min(1),
    datetime: z.string().datetime(),
    reason: z.string().max(1000).optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['accepted', 'rejected']),
  }),
});

async function bookAppointment(req, res, next) {
  try {
    const patientId = req.user.sub;
    const { doctorProfileId, datetime, reason } = req.validated.body;

    const doctorProfile = await DoctorProfile.findById(doctorProfileId);
    if (!doctorProfile) throw Object.assign(new Error('Doctor not found'), { statusCode: 404 });

    const doctorUser = await User.findById(doctorProfile.userId);
    if (!doctorUser || doctorUser.role !== 'doctor') {
      throw Object.assign(new Error('Doctor not found'), { statusCode: 404 });
    }

    const appt = await Appointment.create({
      patientId,
      doctorId: doctorUser._id,
      datetime: new Date(datetime),
      reason: reason || '',
      status: 'pending',
    });

    res.status(201).json({ appointment: appt.toJSON() });
  } catch (err) {
    next(err);
  }
}

async function listMyAppointments(req, res, next) {
  try {
    const userId = req.user.sub;
    const role = req.user.role;
    const filter = role === 'doctor' ? { doctorId: userId } : { patientId: userId };

    const items = await Appointment.find(filter).sort({ datetime: -1 }).limit(100).lean();
    res.json({
      items: items.map((a) => ({ ...a, id: a._id.toString(), _id: undefined, __v: undefined })),
    });
  } catch (err) {
    next(err);
  }
}

async function updateAppointmentStatus(req, res, next) {
  try {
    const doctorId = req.user.sub;
    const { id } = req.params;
    const { status } = req.validated.body;

    const appt = await Appointment.findById(id);
    if (!appt) throw Object.assign(new Error('Appointment not found'), { statusCode: 404 });
    if (appt.doctorId.toString() !== doctorId) {
      throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
    }
    if (appt.status !== 'pending') {
      throw Object.assign(new Error('Only pending appointments can be updated'), { statusCode: 400 });
    }

    appt.status = status;
    await appt.save();
    res.json({ appointment: appt.toJSON() });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  bookAppointment,
  listMyAppointments,
  updateAppointmentStatus,
  bookAppointmentSchema,
  updateStatusSchema,
};

