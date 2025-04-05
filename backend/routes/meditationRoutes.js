const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const {
    saveMeditation,
    getMeditationHistory,
    getTodayMeditation
} = require('../controllers/meditationController');

// All routes are protected and require authentication
router.use(authenticateToken);

// Save a meditation session
router.post('/', saveMeditation);

// Get meditation history
router.get('/history', getMeditationHistory);

// Get today's meditation status
router.get('/today', getTodayMeditation);

module.exports = router; 