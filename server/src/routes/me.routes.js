const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  getMe,
  getMyAnalytics,
  updateMyProfile,
  updatePatientSchema,
  updateDoctorSchema,
} = require('../controllers/me.controller');

const router = express.Router();

router.get('/', requireAuth, getMe);
router.get('/analytics', requireAuth, getMyAnalytics);

router.put('/patient', requireAuth, validate(updatePatientSchema), updateMyProfile);
router.put('/doctor', requireAuth, validate(updateDoctorSchema), updateMyProfile);

module.exports = router;

