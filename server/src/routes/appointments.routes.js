const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  bookAppointment,
  listMyAppointments,
  updateAppointmentStatus,
  bookAppointmentSchema,
  updateStatusSchema,
} = require('../controllers/appointments.controller');

const router = express.Router();

router.get('/me', requireAuth, listMyAppointments);
router.post('/', requireAuth, requireRole('patient'), validate(bookAppointmentSchema), bookAppointment);
router.patch('/:id/status', requireAuth, requireRole('doctor'), validate(updateStatusSchema), updateAppointmentStatus);

module.exports = router;

