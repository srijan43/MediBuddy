import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCalendar, FiClock, FiUser, FiX } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    symptoms: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/patient`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const symptoms = bookingForm.symptoms
        ? bookingForm.symptoms.split(',').map(s => ({
            description: s.trim(),
            severity: 'Mild'
          }))
        : [];

      await axios.post(`${API_URL}/appointments`, {
        doctorId: bookingForm.doctorId,
        appointmentDate: bookingForm.appointmentDate,
        appointmentTime: bookingForm.appointmentTime,
        reason: bookingForm.reason,
        symptoms
      });

      setShowBookingModal(false);
      setBookingForm({
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        symptoms: ''
      });
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  const cancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.delete(`${API_URL}/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        alert('Failed to cancel appointment');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const upcoming = appointments.filter(apt => 
    new Date(apt.appointmentDate) >= new Date() && apt.status === 'Scheduled'
  );
  const past = appointments.filter(apt => 
    new Date(apt.appointmentDate) < new Date() || apt.status !== 'Scheduled'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <button
          onClick={() => setShowBookingModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
        {upcoming.length > 0 ? (
          <div className="space-y-4">
            {upcoming.map((apt) => (
              <div key={apt._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <FiUser className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-semibold">
                        Dr. {apt.doctor?.fullName || 'N/A'}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-2">{apt.doctor?.specialization}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {apt.appointmentTime}
                      </div>
                    </div>
                    {apt.reason && (
                      <p className="mt-2 text-gray-700">
                        <span className="font-medium">Reason:</span> {apt.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {apt.status}
                    </span>
                    {apt.status === 'Scheduled' && (
                      <button
                        onClick={() => cancelAppointment(apt._id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <FiX className="w-4 h-4 mr-1" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming appointments</p>
        )}
      </div>

      {/* Past Appointments */}
      {past.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Past Appointments</h2>
          <div className="space-y-4">
            {past.map((apt) => (
              <div key={apt._id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Dr. {apt.doctor?.fullName || 'N/A'}
                    </h3>
                    <p className="text-gray-600">{apt.doctor?.specialization}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                    </p>
                    {apt.diagnosis && (
                      <p className="mt-2 text-gray-700">
                        <span className="font-medium">Diagnosis:</span> {apt.diagnosis}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Book Appointment</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Doctor
                </label>
                <select
                  required
                  value={bookingForm.doctorId}
                  onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.fullName} - {doctor.specialization} (${doctor.consultationFee})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.appointmentDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, appointmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={bookingForm.appointmentTime}
                  onChange={(e) => setBookingForm({ ...bookingForm, appointmentTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  required
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms (comma-separated)
                </label>
                <input
                  type="text"
                  value={bookingForm.symptoms}
                  onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                  placeholder="e.g., Headache, Fever"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;

