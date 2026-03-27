const bcrypt = require('bcrypt');
const { z } = require('zod');
const { User } = require('../models/User');
const { PatientProfile } = require('../models/PatientProfile');
const { DoctorProfile } = require('../models/DoctorProfile');
const { signAccessToken } = require('../utils/jwt');

const signupSchema = z.object({
  body: z.object({
    role: z.enum(['patient', 'doctor']),
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    specialization: z.string().min(2).max(80).optional(), // required for doctors (validated below)
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1).max(72),
  }),
});

async function signup(req, res, next) {
  try {
    const { role, name, email, password, specialization } = req.validated.body;

    if (role === 'doctor' && !specialization) {
      throw Object.assign(new Error('Doctor specialization is required'), { statusCode: 400 });
    }

    const exists = await User.findOne({ email });
    if (exists) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ role, name, email, passwordHash });

    if (role === 'patient') {
      await PatientProfile.create({ userId: user._id });
    } else {
      await DoctorProfile.create({ userId: user._id, specialization });
    }

    const token = signAccessToken(user);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.validated.body;
    const user = await User.findOne({ email });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    const token = signAccessToken(user);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, signupSchema, loginSchema };

