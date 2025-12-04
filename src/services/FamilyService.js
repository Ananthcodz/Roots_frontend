import axios from 'axios';

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
 * FamilyService handles all family member and relationship API calls
 */
const FamilyService = {
  /**
   * Add a new family member
   * @param {Object} memberData - Family member data
   * @returns {Promise<Object>} Created family member
   */
  async addFamilyMember(memberData) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE_URL}/family/members`,
          memberData,
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
        const message = error.response.data.message || 'Invalid family member data';
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
      throw new Error(error.message || 'Failed to add family member');
    }
  },

  /**
   * Update an existing family member
   * @param {string} memberId - Family member ID
   * @param {Object} memberData - Updated family member data
   * @returns {Promise<Object>} Updated family member
   */
  async updateFamilyMember(memberId, memberData) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(
          `${API_BASE_URL}/family/members/${memberId}`,
          memberData,
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
        const message = error.response.data.message || 'Invalid family member data';
        const validationErrors = error.response.data.errors || {};
        throw { message, validationErrors, isValidationError: true };
      }
      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error('Family member not found');
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
      throw new Error(error.message || 'Failed to update family member');
    }
  },

  /**
   * Get all family members for the current user
   * @returns {Promise<Array>} List of family members
   */
  async getFamilyMembers() {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/family/members`, {
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
      throw new Error(error.message || 'Failed to fetch family members');
    }
  },

  /**
   * Get all relationships for the current user's family tree
   * @returns {Promise<Array>} List of relationships
   */
  async getRelationships() {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/family/relationships`, {
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
      throw new Error(error.message || 'Failed to fetch relationships');
    }
  },
};

export default FamilyService;
