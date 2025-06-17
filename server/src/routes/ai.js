import express from 'express';
import { getRecommendations, generateRecommendation, markRecommendationAsRead } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get AI recommendations
router.get('/recommendations', protect, getRecommendations);

// Generate new AI recommendation
router.post('/generate-recommendation', protect, generateRecommendation);

// Mark recommendation as read
router.put('/recommendations/:id/read', protect, markRecommendationAsRead);

export default router;