import { API_ENDPOINTS } from './config.js';

// API request helper with timeout
const apiRequest = async (endpoint, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(endpoint, {
            ...options,
            headers,
            signal: controller.signal
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        console.error(`API request failed: ${error.message}`);
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
};

<<<<<<< HEAD
// Check server health
export const checkServerHealth = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.health);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Server health check:', data);
        return data.status === 'ok';
    } catch (error) {
        console.error('Server health check failed:', error);
        return false;
    }
};

// User authentication
export const registerUser = async (userData) => {
    try {
        const data = await apiRequest(API_ENDPOINTS.register, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const loginUser = async (credentials) => {
    try {
        const data = await apiRequest(API_ENDPOINTS.login, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

=======
>>>>>>> 22022328ee1c771512624d3385c4061569c4ca57
// Game scores
export const saveGameScore = async (scoreData) => {
    try {
        const data = await apiRequest(API_ENDPOINTS.saveScore, {
            method: 'POST',
            body: JSON.stringify(scoreData)
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getUserScores = async () => {
    try {
        const data = await apiRequest(API_ENDPOINTS.getScores);
        return data.scores;
    } catch (error) {
        console.error('Failed to get scores:', error);
        return null;
    }
};

// Meditation functions
export const saveMeditation = async (duration, eyesClosedDuration = 0) => {
    try {
        const data = await apiRequest(API_ENDPOINTS.saveMeditation, {
            method: 'POST',
            body: JSON.stringify({ duration, eyesClosedDuration })
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getMeditationHistory = async () => {
    try {
        const data = await apiRequest(API_ENDPOINTS.getMeditationHistory);
        return data.data;
    } catch (error) {
        console.error('Failed to get meditation history:', error);
        return null;
    }
};

export const getTodayMeditation = async () => {
    try {
        const data = await apiRequest(API_ENDPOINTS.getTodayMeditation);
        return data.data;
    } catch (error) {
        console.error('Failed to get today\'s meditation:', error);
        return null;
    }
};

// Check meditation status and show notification if needed
export const checkMeditationStatus = async () => {
    try {
        const meditationData = await getTodayMeditation();
        if (meditationData && !meditationData.completed) {
            showMeditationNotification();
        }
    } catch (error) {
        console.error('Failed to check meditation status:', error);
    }
};

// Show meditation notification with modern notification options
const showMeditationNotification = () => {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Daily Meditation Reminder', {
                    body: 'You haven\'t completed your 10-minute meditation today. Take a moment to relax and focus.',
                    icon: '/images/meditation-icon.png',
                    badge: '/images/meditation-badge.png',
                    tag: 'meditation-reminder',
                    renotify: true,
                    requireInteraction: true,
                    actions: [
                        {
                            action: 'start',
                            title: 'Start Meditation'
                        },
                        {
                            action: 'snooze',
                            title: 'Remind Later'
                        }
                    ]
                });
            }
        });
    }
};

// User state with type checking
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        
        const user = JSON.parse(userStr);
        // Basic type checking
        if (typeof user !== 'object' || user === null) {
            throw new Error('Invalid user data');
        }
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}; 