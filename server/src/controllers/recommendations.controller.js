const { z } = require('zod');
const { Recommendation } = require('../models/Recommendation');
const { PatientProfile } = require('../models/PatientProfile');
const { analyzeSymptoms } = require('../services/symptomEngine');

const createRecommendationSchema = z.object({
  body: z.object({
    symptoms: z.array(z.string().min(1).max(80)).min(1).max(20),
  }),
});

async function createRecommendation(req, res, next) {
  try {
    const patientId = req.user.sub;
    const { symptoms } = req.validated.body;

    await PatientProfile.findOneAndUpdate(
      { userId: patientId },
      { $set: { recentSymptoms: symptoms } },
      { upsert: true, new: true }
    );

    const analysis = analyzeSymptoms({ symptoms });

    const rec = await Recommendation.create({
      patientId,
      symptoms,
      ...analysis,
    });

    res.status(201).json({ recommendation: rec.toJSON() });
  } catch (err) {
    next(err);
  }
}

async function listMyRecommendations(req, res, next) {
  try {
    const patientId = req.user.sub;
    const items = await Recommendation.find({ patientId }).sort({ createdAt: -1 }).limit(20);
    res.json({ items: items.map((i) => i.toJSON()) });
  } catch (err) {
    next(err);
  }
}

module.exports = { createRecommendation, listMyRecommendations, createRecommendationSchema };

