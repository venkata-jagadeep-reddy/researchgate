const User = require('../models/User');

// Save a game score
const saveScore = async (req, res) => {
    try {
        const { game, score } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.gameScores.push({ game, score });
        await user.save();

        res.status(201).json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error('Score saving error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's game scores
const getScores = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.gameScores);
    } catch (error) {
        console.error('Score retrieval error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    saveScore,
    getScores
}; 