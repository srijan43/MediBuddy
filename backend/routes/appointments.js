const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { authenticate } = require('../middleware/auth');

// Create appointment
router.post('/', authenticate, async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason, symptoms } = req.body;

    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patient: req.userId,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms: symptoms || []
    });

    await appointment.save();

    // Add to patient and doctor records
    const patient = await Patient.findById(req.userId);
    patient.appointments.push(appointment._id);
    await patient.save();

    doctor.appointments.push(appointment._id);
    await doctor.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'username email age gender')
      .populate('doctor', 'fullName specialization consultationFee');

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get patient appointments
router.get('/patient', authenticate, async (req, res) => {
  try {
    if (req.userType !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appointments = await Appointment.find({ patient: req.userId })
      .populate('doctor', 'fullName specialization consultationFee rating')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get doctor appointments
router.get('/doctor', authenticate, async (req, res) => {
  try {
    if (req.userType !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appointments = await Appointment.find({ doctor: req.userId })
      .populate('patient', 'username email age gender')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment status
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status, notes, diagnosis, prescription } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (req.userType === 'patient' && appointment.patient.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.userType === 'doctor' && appointment.doctor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (prescription) appointment.prescription = prescription;

    appointment.updatedAt = Date.now();
    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'username email age gender')
      .populate('doctor', 'fullName specialization');

    res.json({
      message: 'Appointment updated successfully',
      appointment: populatedAppointment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel appointment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.userType === 'patient' && appointment.patient.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = 'Cancelled';
    appointment.updatedAt = Date.now();
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

