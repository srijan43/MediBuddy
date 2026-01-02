import React, { useState } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SymptomAnalysis = () => {
  const [symptoms, setSymptoms] = useState([{ description: '', severity: 'Mild', duration: '' }]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSymptomChange = (index, field, value) => {
    const updated = [...symptoms];
    updated[index][field] = value;
    setSymptoms(updated);
  };

  const addSymptom = () => {
    setSymptoms([...symptoms, { description: '', severity: 'Mild', duration: '' }]);
  };

  const removeSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const validSymptoms = symptoms.filter(s => s.description.trim() !== '');
    if (validSymptoms.length === 0) {
      setError('Please enter at least one symptom');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/symptoms/analyze`, {
        symptoms: validSymptoms
      });
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Symptom Analysis</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Enter Your Symptoms</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {symptoms.map((symptom, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptom Description
                  </label>
                  <input
                    type="text"
                    value={symptom.description}
                    onChange={(e) => handleSymptomChange(index, 'description', e.target.value)}
                    placeholder="e.g., Headache, Fever, Chest pain"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity
                    </label>
                    <select
                      value={symptom.severity}
                      onChange={(e) => handleSymptomChange(index, 'severity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={symptom.duration}
                      onChange={(e) => handleSymptomChange(index, 'duration', e.target.value)}
                      placeholder="e.g., 2 days, 1 week"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {symptoms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSymptom(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addSymptom}
              className="text-blue-600 text-sm hover:underline"
            >
              + Add Another Symptom
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {analysis && (
            <>
              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FiCheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Recommendations
                </h2>
                <div className="space-y-3">
                  {analysis.analysis.recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <p className="font-semibold text-gray-900">{rec.type}</p>
                      <p className="text-gray-700">{rec.description}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                        rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialist Referrals */}
              {analysis.analysis.specialistReferrals.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    Recommended Specialists
                  </h2>
                  <div className="space-y-2">
                    {analysis.analysis.specialistReferrals.map((ref, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium">{ref.specialty}</span>
                        <span className="text-sm text-gray-600">
                          {Math.round(ref.confidence * 100)}% match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Doctors */}
              {analysis.recommendedDoctors.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Available Doctors</h2>
                  <div className="space-y-3">
                    {analysis.recommendedDoctors.map((doctor) => (
                      <div key={doctor._id} className="border rounded-lg p-4">
                        <p className="font-semibold">Dr. {doctor.fullName}</p>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        <p className="text-sm text-gray-500">
                          Experience: {doctor.experience} years | Rating: {doctor.rating}/5
                        </p>
                        <p className="text-sm font-medium text-blue-600 mt-2">
                          Consultation Fee: ${doctor.consultationFee}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!analysis && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              Enter your symptoms and click "Analyze Symptoms" to get personalized recommendations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomAnalysis;

