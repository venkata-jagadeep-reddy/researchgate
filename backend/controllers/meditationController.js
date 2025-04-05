const Meditation = require('../models/Meditation');
const User = require('../models/User');

// Save meditation session
exports.saveMeditation = async (req, res) => {
    try {
        const { duration, eyesClosedDuration } = req.body;
        const userId = req.user.id;

        const meditation = new Meditation({
            user: userId,
            duration,
            eyesClosedDuration: eyesClosedDuration || 0,
            date: new Date()
        });

        await meditation.save();

        res.status(201).json({
            success: true,
            data: meditation
        });
    } catch (error) {
        console.error('Save meditation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save meditation session'
        });
    }
};

// Get user's meditation history
exports.getMeditationHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const meditations = await Meditation.find({ user: userId })
            .sort({ date: -1 })
            .limit(30); // Last 30 sessions

        res.status(200).json({
            success: true,
            data: meditations
        });
    } catch (error) {
        console.error('Get meditation history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get meditation history'
        });
    }
};

// Get today's meditation status
exports.getTodayMeditation = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayMeditations = await Meditation.find({
            user: userId,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        const totalDuration = todayMeditations.reduce((sum, med) => sum + med.duration, 0);
        const totalEyesClosedDuration = todayMeditations.reduce((sum, med) => sum + (med.eyesClosedDuration || 0), 0);
        const dailyGoal = 600; // 10 minutes in seconds

        res.status(200).json({
            success: true,
            data: {
                totalDuration,
                totalEyesClosedDuration,
                dailyGoal,
                completed: totalDuration >= dailyGoal,
                sessions: todayMeditations
            }
        });
    } catch (error) {
        console.error('Get today meditation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get today\'s meditation status'
        });
    }
}; 