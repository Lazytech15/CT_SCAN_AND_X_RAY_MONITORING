// services/userService.js
import { API_ENDPOINTS, API_CONFIG } from '../config/apiConfig';

const USERS_API = `${API_ENDPOINTS.AUTH.replace('/auth.php', '')}/users_api.php`;

/**
 * Get current user profile
 */
export const getProfile = async () => {
  try {
    const response = await fetch(`${USERS_API}?action=profile`, {
      method: 'GET',
      ...API_CONFIG,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Get all users (admin only)
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${USERS_API}?action=all`, {
      method: 'GET',
      ...API_CONFIG,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${USERS_API}?action=update`, {
      method: 'PUT',
      ...API_CONFIG,
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Change user password
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${USERS_API}?action=change_password`, {
      method: 'PUT',
      ...API_CONFIG,
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }

    return data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profile_image', imageFile);

    const response = await fetch(`${USERS_API}?action=upload_profile`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Note: Don't set Content-Type header for FormData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload profile image');
    }

    return data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

/**
 * Create new user (admin only)
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${USERS_API}?action=create`, {
      method: 'POST',
      ...API_CONFIG,
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }

    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${USERS_API}?action=delete`, {
      method: 'DELETE',
      ...API_CONFIG,
      body: JSON.stringify({ id: userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete user');
    }

    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};