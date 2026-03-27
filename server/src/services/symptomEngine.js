const RULES = [
  {
    when: ['fever', 'cough', 'sore throat'],
    conditions: ['Viral upper respiratory infection', 'Influenza (possible)'],
    specializations: ['General Physician'],
    advice: ['Stay hydrated', 'Rest', 'Monitor temperature', 'Seek care if symptoms worsen or persist > 3 days'],
    confidence: 0.62,
  },
  {
    when: ['chest pain', 'shortness of breath'],
    conditions: ['Cardiac event (rule out)', 'Pulmonary embolism (rule out)'],
    specializations: ['Cardiologist', 'Pulmonologist'],
    advice: ['Seek emergency care immediately'],
    confidence: 0.9,
  },
  {
    when: ['headache', 'sensitivity to light', 'nausea'],
    conditions: ['Migraine'],
    specializations: ['Neurologist'],
    advice: ['Avoid triggers', 'Hydrate', 'Consider OTC pain relief if appropriate'],
    confidence: 0.7,
  },
  {
    when: ['rash', 'itching'],
    conditions: ['Allergic dermatitis'],
    specializations: ['Dermatologist', 'Allergist'],
    advice: ['Avoid new irritants', 'Consider antihistamine if appropriate'],
    confidence: 0.66,
  },
];

function normalize(symptoms) {
  return symptoms
    .map((s) => (s || '').trim().toLowerCase())
    .filter(Boolean)
    .map((s) => s.replace(/\s+/g, ' '));
}

function analyzeSymptoms({ symptoms = [] }) {
  const s = new Set(normalize(symptoms));
  const matched = RULES.filter((r) => r.when.every((w) => s.has(w)));

  if (matched.length === 0) {
    return {
      possibleConditions: ['Unclear – needs clinical assessment'],
      suggestedSpecializations: ['General Physician'],
      advice: ['Provide more details about symptom onset, severity, and duration', 'Seek medical advice if concerned'],
      confidence: 0.45,
    };
  }

  const conditions = [...new Set(matched.flatMap((m) => m.conditions))];
  const specializations = [...new Set(matched.flatMap((m) => m.specializations))];
  const advice = [...new Set(matched.flatMap((m) => m.advice))];
  const confidence = Math.max(...matched.map((m) => m.confidence || 0.6));

  return { possibleConditions: conditions, suggestedSpecializations: specializations, advice, confidence };
}

module.exports = { analyzeSymptoms };

