const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createRecommendation,
  listMyRecommendations,
  createRecommendationSchema,
} = require('../controllers/recommendations.controller');

const router = express.Router();

router.get('/me', requireAuth, requireRole('patient'), listMyRecommendations);
router.post('/', requireAuth, requireRole('patient'), validate(createRecommendationSchema), createRecommendation);

module.exports = router;

