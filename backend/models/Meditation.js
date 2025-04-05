const mongoose = require('mongoose');

const meditationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    completed: {
        type: Boolean,
        default: true
    }
});

// Add index for efficient querying of user's meditation history
meditationSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Meditation', meditationSchema); 