import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const HealthInsights = () => {
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get(`${API_URL}/recommendations/personalized`);
      setInsights(response.data);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching insights:', error);
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

  const chartData = insights?.insights?.map(insight => ({
    name: insight.metric,
    value: insight.value
  })) || [];

  const recommendationData = recommendations?.map((rec, index) => ({
    name: rec.type,
    value: rec.priority === 'High' ? 3 : rec.priority === 'Medium' ? 2 : 1
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Health Insights & Recommendations</h1>

      {/* Patient Summary */}
      {insights?.patientSummary && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Health Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-2xl font-bold">{insights.patientSummary.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="text-2xl font-bold">{insights.patientSummary.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Symptoms</p>
              <p className="text-2xl font-bold">{insights.patientSummary.totalSymptoms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Conditions</p>
              <p className="text-2xl font-bold">{insights.patientSummary.activeConditions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {chartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Health Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {recommendationData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendation Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={recommendationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {recommendationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiActivity className="w-5 h-5 mr-2 text-blue-600" />
          Personalized Recommendations
        </h2>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded ${
                rec.priority === 'High'
                  ? 'border-red-500 bg-red-50'
                  : rec.priority === 'Medium'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-green-500 bg-green-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    {rec.priority === 'High' ? (
                      <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    ) : (
                      <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    )}
                    <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                  </div>
                  <p className="text-gray-700">{rec.description}</p>
                  {rec.conditions && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-600">Conditions:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {rec.conditions.map((condition, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-200 rounded text-xs"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rec.priority === 'High'
                      ? 'bg-red-100 text-red-800'
                      : rec.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {rec.priority} Priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {insights?.insights && insights.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Health Insights
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {insights.insights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">{insight.metric}</p>
                <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
                <p className="text-xs text-gray-500 mt-1">{insight.trend}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthInsights;

