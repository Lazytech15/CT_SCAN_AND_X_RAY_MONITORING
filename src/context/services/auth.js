// auth.js
import { API_ENDPOINTS, API_CONFIG } from '../config/apiConfig';

/**
 * Authenticate user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response with success status and user data
 */
export const auth = async (email, password) => {
  try {
    const response = await fetch(API_ENDPOINTS.AUTH, {
      method: 'POST',
      ...API_CONFIG,
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    // Store user data in localStorage (session is handled by cookies)
    if (data.success && data.data.user) {
      localStorage.setItem('user', JSON.stringify(data.data.user));
      // Set a flag to indicate user is authenticated
      localStorage.setItem('isAuthenticated', 'true');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  
  // Optional: Call backend logout endpoint to destroy session
  try {
    await fetch(`${API_ENDPOINTS.AUTH.replace('/auth.php', '')}/logout.php`, {
      method: 'POST',
      ...API_CONFIG,
    });
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

/**
 * Get current user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Get authentication token (not used in session-based auth, kept for compatibility)
 * @returns {string|null}
 */
export const getToken = () => {
  // Session-based auth doesn't use tokens
  // This is kept for backward compatibility
  return null;
};