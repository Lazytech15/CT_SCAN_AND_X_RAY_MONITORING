// ============================================
// services/xrayService.js

const XRAY_API_BASE_URL = 'http://qxw.2ee.mytemp.website/projectipt2/api/xrays_api.php';

/**
 * Upload an image for X-Ray
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise} - Promise resolving to upload result with URL
 */
export const uploadXRayImage = async (file, onProgress = null) => {
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

    xhr.open('POST', `${XRAY_API_BASE_URL}?action=upload`);
    xhr.send(formData);
  });
};

/**
 * Get all X-rays with optional filters
 * @param {string} searchTerm - Search term for patient name or ID
 * @param {string} severity - Filter by severity (all, Stable, Moderate, Urgent, Critical)
 * @returns {Promise} - Promise resolving to X-rays data
 */
export const getAllXRays = async (searchTerm = '', severity = 'all') => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (severity !== 'all') params.append('severity', severity);
    
    const url = `${XRAY_API_BASE_URL}${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch X-rays');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch X-rays');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching X-rays:', error);
    throw error;
  }
};

/**
 * Get a single X-ray by ID
 * @param {number} id - X-ray ID
 * @returns {Promise} - Promise resolving to X-ray data
 */
export const getXRayById = async (id) => {
  try {
    const response = await fetch(`${XRAY_API_BASE_URL}?id=${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch X-ray');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch X-ray');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching X-ray:', error);
    throw error;
  }
};

/**
 * Create a new X-ray record
 * @param {Object} xrayData - X-ray data
 * @returns {Promise} - Promise resolving to created X-ray
 */
export const createXRay = async (xrayData) => {
  try {
    const response = await fetch(XRAY_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(xrayData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create X-ray');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to create X-ray');
    }
    
    return result;
  } catch (error) {
    console.error('Error creating X-ray:', error);
    throw error;
  }
};

/**
 * Update an existing X-ray record
 * @param {number} id - X-ray ID
 * @param {Object} xrayData - Updated X-ray data
 * @returns {Promise} - Promise resolving to update result
 */
export const updateXRay = async (id, xrayData) => {
  try {
    const response = await fetch(`${XRAY_API_BASE_URL}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(xrayData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update X-ray');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to update X-ray');
    }
    
    return result;
  } catch (error) {
    console.error('Error updating X-ray:', error);
    throw error;
  }
};

/**
 * Delete an X-ray record
 * @param {number} id - X-ray ID
 * @returns {Promise} - Promise resolving to delete result
 */
export const deleteXRay = async (id) => {
  try {
    const response = await fetch(`${XRAY_API_BASE_URL}?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete X-ray');
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete X-ray');
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting X-ray:', error);
    throw error;
  }
};