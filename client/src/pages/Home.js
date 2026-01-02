import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiUsers, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Personalized healthcare powered by
          </h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            advanced AI for better health
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Medibuddy provides individually tailored healthcare recommendations using AI
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            analysis of your unique profile and goals to promote better outcomes.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <FiActivity className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Symptom Analysis</h3>
            <p className="text-gray-600">
              Get intelligent analysis of your symptoms with personalized health recommendations
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <FiUsers className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Specialist Referrals</h3>
            <p className="text-gray-600">
              Receive smart referrals to the right specialists based on your health profile
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <FiCalendar className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">
              Book appointments seamlessly with verified doctors and specialists
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <FiTrendingUp className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Health Insights</h3>
            <p className="text-gray-600">
              Track your health metrics and get insights into your wellness journey
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

