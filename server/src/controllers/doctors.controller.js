const { z } = require('zod');
const { User } = require('../models/User');
const { DoctorProfile } = require('../models/DoctorProfile');

const listDoctorsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    specialization: z.string().optional(),
    city: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

async function listDoctors(req, res, next) {
  try {
    const { q, specialization, city, page, limit } = req.validated.query;
    const skip = (page - 1) * limit;

    const userFilter = { role: 'doctor' };
    if (q) userFilter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];

    const doctorUsers = await User.find(userFilter).select('_id name email role').lean();
    const userIds = doctorUsers.map((u) => u._id);

    const profileFilter = { userId: { $in: userIds }, acceptingNewPatients: true };
    if (specialization) profileFilter.specialization = new RegExp(`^${specialization}$`, 'i');
    if (city) profileFilter.city = new RegExp(city, 'i');

    const total = await DoctorProfile.countDocuments(profileFilter);
    const profiles = await DoctorProfile.find(profileFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    const byUserId = new Map(doctorUsers.map((u) => [u._id.toString(), u]));
    const items = profiles.map((p) => ({
      id: p._id.toString(),
      user: byUserId.get(p.userId.toString()) || null,
      profile: { ...p, id: p._id.toString(), _id: undefined, __v: undefined },
    }));

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getDoctor(req, res, next) {
  try {
    const { id } = req.params;
    const profile = await DoctorProfile.findById(id).lean();
    if (!profile) throw Object.assign(new Error('Doctor not found'), { statusCode: 404 });

    const user = await User.findById(profile.userId).select('_id name email role').lean();
    res.json({
      doctor: {
        id: profile._id.toString(),
        user: user ? { id: user._id.toString(), name: user.name, email: user.email, role: user.role } : null,
        profile: { ...profile, id: profile._id.toString(), _id: undefined, __v: undefined },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listDoctors, getDoctor, listDoctorsSchema };

