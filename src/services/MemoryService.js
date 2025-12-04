import axios from 'axios';
import UserService from './UserService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Retry a failed request with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @returns {Promise} Result of the function
 */
const retryWithBackoff = async (fn, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Only retry on network errors or 5xx server errors
      const shouldRetry = 
        !error.response || 
        (error.response?.status >= 500 && error.response?.status < 600);
      
      if (!shouldRetry || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * MemoryService handles all photo upload and memory management API calls
 */
const MemoryService = {
  /**
   * Upload photos and create a memory
   * @param {File[]} files - Array of photo files to upload
   * @param {Object} memoryData - Memory metadata (album, location, date, tags, description)
   * @param {Function} onProgress - Progress callback function (0-100)
   * @returns {Promise<Object>} Created memory with photo URLs and partial failure info
   */
  async uploadPhotos(files, memoryData, onProgress) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const formData = new FormData();

        // Compress and append each photo
        const compressionErrors = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            // Reuse UserService.compressImage for photo compression
            const compressedBlob = await UserService.compressImage(file, 1200, 1200, 0.85);
            formData.append('photos', compressedBlob, file.name);
          } catch (compressionError) {
            compressionErrors.push({ file: file.name, error: 'Failed to compress image' });
          }
        }

        // If all files failed compression, throw error
        if (compressionErrors.length === files.length) {
          throw new Error('Failed to compress all photos. Please try again.');
        }

        // Append memory metadata
        if (memoryData.albumId) {
          formData.append('albumId', memoryData.albumId);
        }
        if (memoryData.location) {
          formData.append('location', memoryData.location);
        }
        if (memoryData.dateTaken) {
          formData.append('dateTaken', memoryData.dateTaken);
        }
        if (memoryData.description) {
          formData.append('description', memoryData.description);
        }
        if (memoryData.taggedPeople && memoryData.taggedPeople.length > 0) {
          formData.append('taggedPeople', JSON.stringify(memoryData.taggedPeople));
        }

        const response = await axios.post(
          `${API_BASE_URL}/memories/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              if (onProgress && progressEvent.total) {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(percentCompleted);
              }
            },
          }
        );
        
        // Include compression errors in response if any
        if (compressionErrors.length > 0) {
          return {
            ...response.data,
            partialFailures: compressionErrors,
            hasPartialFailures: true,
          };
        }
        
        return response.data;
      });
    } catch (error) {
      // Handle validation errors from server
      if (error.response?.status === 400) {
        const message = error.response.data.message || 'Invalid photo or memory data';
        const validationErrors = error.response.data.errors || {};
        throw { message, validationErrors, isValidationError: true };
      }
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle file size errors
      if (error.response?.status === 413) {
        throw new Error('File size too large. Maximum 10MB per photo.');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to upload photos');
    }
  },

  /**
   * Create a memory without uploading new photos
   * @param {Object} memoryData - Memory data including existing photo URLs
   * @returns {Promise<Object>} Created memory
   */
  async createMemory(memoryData) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE_URL}/memories`,
          memoryData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      });
    } catch (error) {
      // Handle validation errors from server
      if (error.response?.status === 400) {
        const message = error.response.data.message || 'Invalid memory data';
        const validationErrors = error.response.data.errors || {};
        throw { message, validationErrors, isValidationError: true };
      }
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to create memory');
    }
  },

  /**
   * Get all albums for the current user
   * @returns {Promise<Array>} List of albums
   */
  async getAlbums() {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/albums`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      });
    } catch (error) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to fetch albums');
    }
  },

  /**
   * Search for family members by name
   * @param {string} query - Search query
   * @returns {Promise<Array>} List of matching family members
   */
  async searchMembers(query) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${API_BASE_URL}/family/members/search`,
          {
            params: { q: query },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      });
    } catch (error) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      // Handle server errors
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(error.message || 'Failed to search family members');
    }
  },
};

export default MemoryService;
