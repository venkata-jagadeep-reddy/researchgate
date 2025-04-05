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
            throw new Error(data.errors?.[0]?.message || `Request failed with status ${response.status}`);
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

// Check server health
export const checkServerHealth = async () => {
    try {
        const response = await fetch(API_ENDPOINTS.health);
        const data = await response.json();
        console.log('Server health check:', data);
        return data.status === 'ok';
    } catch (error) {
        console.error('Server health check failed:', error);
        return false;
    }
};

// User authentication functions
export const registerUser = async (userData) => {
    try {
        const data = await apiRequest(API_ENDPOINTS.register, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (data.success) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return { success: true };
        } else {
            return { success: false, message: data.errors[0].message };
        }
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

        if (data.success) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return { success: true };
        } else {
            return { success: false, message: data.errors[0].message };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

// User state management
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

export const isAuthenticated = () => {
    return Boolean(localStorage.getItem('token'));
}; 