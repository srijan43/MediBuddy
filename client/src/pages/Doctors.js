import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUser, FiStar, FiDollarSign, FiBriefcase } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (specialization) {
      setFilteredDoctors(doctors.filter(d => d.specialization === specialization));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [specialization, doctors]);

  const fetchDoctors = async () => {
    try {
      const params = specialization ? { specialization } : {};
      const response = await axios.get(`${API_URL}/doctors`, { params });
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Psychiatry',
    'Pulmonology', 'Rheumatology', 'Urology', 'General Medicine'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Doctor</h1>

      {/* Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Specialization
        </label>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Dr. {doctor.fullName}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FiBriefcase className="w-4 h-4 mr-2" />
                  {doctor.experience} years of experience
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiStar className="w-4 h-4 mr-2 text-yellow-500" />
                  {doctor.rating.toFixed(1)} / 5.0 ({doctor.totalReviews} reviews)
                </div>
                <div className="flex items-center text-sm font-medium text-blue-600">
                  <FiDollarSign className="w-4 h-4 mr-1" />
                  ${doctor.consultationFee} consultation fee
                </div>
              </div>

              {doctor.availability && doctor.availability.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1">Availability:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.availability.slice(0, 3).map((avail, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {avail.day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={`/appointments?doctor=${doctor._id}`}
                className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Book Appointment
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No doctors found with the selected specialization.</p>
        </div>
      )}
    </div>
  );
};

export default Doctors;

