// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// API Endpoints
const API_ENDPOINTS = {
    // Auth endpoints
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    
    // Score endpoints
    saveScore: `${API_BASE_URL}/scores`,
    getScores: `${API_BASE_URL}/scores`,
    
    // Health check
    health: `${API_BASE_URL}/health`
};

// Export the configuration
export { API_BASE_URL, API_ENDPOINTS }; 