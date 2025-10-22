// apiService.js
import * as authService from './services/auth';
import * as xrayService from './services/xrayService';
import * as ctScanService from './services/ctScanService';

/**
 * Central API Service
 * Import and export all API services from here
 */
const apiService = {
  // Authentication methods
  auth: authService.auth,
  logout: authService.logout,
  isAuthenticated: authService.isAuthenticated,
  getCurrentUser: authService.getCurrentUser,
  getToken: authService.getToken,
  
  // X-Ray methods
  xrays: {
    getAll: xrayService.getAllXRays,
    getById: xrayService.getXRayById,
    create: xrayService.createXRay,
    update: xrayService.updateXRay,
    delete: xrayService.deleteXRay,
    uploadImage: xrayService.uploadXRayImage,
  },
  
  // CT Scan methods
  ctScans: {
    getAll: ctScanService.getAllCTScans,
    getById: ctScanService.getCTScanById,
    create: ctScanService.createCTScan,
    update: ctScanService.updateCTScan,
    delete: ctScanService.deleteCTScan,
    uploadImage: ctScanService.uploadCTScanImage,
  },
};

export default apiService;