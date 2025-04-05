import { API_ENDPOINTS } from './config.js';

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(endpoint, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error(`API request failed: ${error.message}`);
        throw error;
    }
};

// Check server health
export const checkServerHealth = async () => {
    try {
        const data = await apiRequest(API_ENDPOINTS.health);
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

// User state
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
    return Boolean(localStorage.getItem('token'));
}; 