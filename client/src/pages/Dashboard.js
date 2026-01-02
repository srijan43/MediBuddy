import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiActivity, FiCalendar, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_URL}/patients/profile`),
        axios.get(`${API_URL}/appointments/patient`)
      ]);
      setPatientData(patientRes.data);
      setAppointments(appointmentsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.appointmentDate) >= new Date() && apt.status === 'Scheduled'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Symptoms</p>
              <p className="text-2xl font-bold text-gray-900">
                {patientData?.symptoms?.length || 0}
              </p>
            </div>
            <FiActivity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Conditions</p>
              <p className="text-2xl font-bold text-gray-900">
                {patientData?.medicalHistory?.filter(m => m.status === 'Active').length || 0}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingAppointments.length}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.length}
              </p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          to="/symptom-analysis"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2">Analyze Symptoms</h3>
          <p className="text-gray-600">
            Get personalized health recommendations based on your symptoms
          </p>
        </Link>

        <Link
          to="/health-insights"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2">View Health Insights</h3>
          <p className="text-gray-600">
            Track your health metrics and get personalized recommendations
          </p>
        </Link>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Appointments</h2>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      Dr. {apt.doctor?.fullName || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {apt.doctor?.specialization}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No appointments yet. <Link to="/doctors" className="text-blue-600 hover:underline">Book one now</Link></p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

