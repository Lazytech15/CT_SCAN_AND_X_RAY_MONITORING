// apiConfig.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://qxw.2ee.mytemp.website/projectipt2/api';

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth.php`,
  // Add more endpoints here as needed
};

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // For cookies if needed
};

export default API_BASE_URL;