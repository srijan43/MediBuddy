const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    symptoms: [{ type: String, required: true }],
    possibleConditions: [{ type: String }],
    suggestedSpecializations: [{ type: String }],
    advice: [{ type: String }],
    confidence: { type: Number, min: 0, max: 1, default: 0.6 },
  },
  { timestamps: true }
);

recommendationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = { Recommendation };

