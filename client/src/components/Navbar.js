import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUser, FiLogOut, FiActivity, FiCalendar, FiUsers } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/Medibuddylogo.png" 
                alt="Medibuddy Logo" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold">Medibuddy</span>
            </Link>
            {token && (
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  <FiHome className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/symptom-analysis"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  <FiActivity className="w-4 h-4" />
                  <span>Symptom Analysis</span>
                </Link>
                <Link
                  to="/appointments"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  <FiCalendar className="w-4 h-4" />
                  <span>Appointments</span>
                </Link>
                <Link
                  to="/doctors"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  <FiUsers className="w-4 h-4" />
                  <span>Doctors</span>
                </Link>
                <Link
                  to="/health-insights"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  <FiActivity className="w-4 h-4" />
                  <span>Health Insights</span>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <span className="text-sm">{user?.username || user?.fullName || 'User'}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

