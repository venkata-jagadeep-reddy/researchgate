const express = require('express');
const router = express.Router();
const { saveScore, getScores } = require('../controllers/scoreController');
const authenticateToken = require('../middlewares/auth');

// Save a game score (requires authentication)
router.post('/', authenticateToken, saveScore);

// Get user's game scores (requires authentication)
router.get('/', authenticateToken, getScores);

module.exports = router; 