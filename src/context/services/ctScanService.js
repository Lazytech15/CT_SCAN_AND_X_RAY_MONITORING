// services/ctScanService.js
import { API_ENDPOINTS, API_CONFIG } from '../config/apiConfig';

/**
 * Upload an image for CT Scan
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise} - Promise resolving to upload result with URL
 */
export const uploadCTScanImage = async (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('image', file);

    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(Math.round(percentComplete));
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          if (result.success) {
            resolve(result);
          } else {
            reject(new Error(result.message || 'Upload failed'));
          }
        } catch (error) {
          reject(new Error('Invalid response from server'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', `${API_ENDPOINTS.CT_SCANS}?action=upload`);
    xhr.send(formData);
  });
};

/**
 * Get all CT scans with optional filters
 * @param {string} searchTerm - Search term for patient name or ID
 * @param {string} severity - Filter by severity (all, Stable, Moderate, Urgent, Critical)
 * @returns {Promise} - Promise resolving to CT scans data
 */
export const getAllCTScans = async (searchTerm = '', severity = 'all') => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (severity !== 'all') params.append('severity', severity);
    
    const url = `${API_ENDPOINTS.CT_SCANS}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      ...API_CONFIG,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch CT scans');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch CT scans');
    }
    
    return result.data;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

/**
 * Get a single CT scan by ID
 * @param {number} id - CT scan ID
 * @returns {Promise} - Promise resolving to CT scan data
 */
export const getCTScanById = async (id) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.CT_SCANS}?id=${id}`, {
      method: 'GET',
      ...API_CONFIG,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch CT scan');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch CT scan');
    }
    
    return result.data;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

/**
 * Create a new CT scan record
 * @param {Object} scanData - CT scan data
 * @returns {Promise} - Promise resolving to created CT scan
 */
export const createCTScan = async (scanData) => {
  try {
    const response = await fetch(API_ENDPOINTS.CT_SCANS, {
      method: 'POST',
      ...API_CONFIG,
      body: JSON.stringify(scanData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create CT scan');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create CT scan');
    }
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

/**
 * Update an existing CT scan record
 * @param {number} id - CT scan ID
 * @param {Object} scanData - Updated CT scan data
 * @returns {Promise} - Promise resolving to update result
 */
export const updateCTScan = async (id, scanData) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.CT_SCANS}?id=${id}`, {
      method: 'PUT',
      ...API_CONFIG,
      body: JSON.stringify(scanData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update CT scan');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update CT scan');
    }
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

/**
 * Delete a CT scan record
 * @param {number} id - CT scan ID
 * @returns {Promise} - Promise resolving to delete result
 */
export const deleteCTScan = async (id) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.CT_SCANS}?id=${id}`, {
      method: 'DELETE',
      ...API_CONFIG,
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete CT scan');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete CT scan');
    }
    
    return result;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};