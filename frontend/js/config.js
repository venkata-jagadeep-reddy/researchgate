// API Configuration
<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:3001/api';
=======
const API_BASE_URL = window.location.origin + '/api';
>>>>>>> 22022328ee1c771512624d3385c4061569c4ca57

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    
    // Score endpoints
    saveScore: `${API_BASE_URL}/scores`,
    getScores: `${API_BASE_URL}/scores`,
    
    // Meditation endpoints
    saveMeditation: `${API_BASE_URL}/meditation`,
    getMeditationHistory: `${API_BASE_URL}/meditation/history`,
    getTodayMeditation: `${API_BASE_URL}/meditation/today`,
    
    // Health check
    health: `${API_BASE_URL}/health`
}; 