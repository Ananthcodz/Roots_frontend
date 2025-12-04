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
 * InviteService handles all family tree invitation API calls
 */
const InviteService = {
  /**
   * Validate an invite code format and existence
   * @param {string} inviteCode - 6-character invite code
   * @returns {Promise<Object>} Validation result with tree information
   */
  async validateInviteCode(inviteCode) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE_URL}/invites/validate`,
          { inviteCode },
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
      // Handle invalid code errors
      if (error.response?.status === 404) {
        throw new Error('Invalid invite code. Please check the code and try again.');
      }
      // Handle expired code errors
      if (error.response?.status === 410) {
        throw new Error('This invite code has expired. Please request a new one.');
      }
      // Handle already member errors
      if (error.response?.status === 409) {
        throw new Error('You are already a member of this family tree.');
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
      throw new Error(error.message || 'Failed to validate invite code');
    }
  },

  /**
   * Join a family tree using an invite code
   * @param {string} inviteCode - 6-character invite code
   * @returns {Promise<Object>} Joined tree information
   */
  async joinTree(inviteCode) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE_URL}/invites/join`,
          { inviteCode },
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
      // Handle invalid code errors
      if (error.response?.status === 404) {
        throw new Error('Invalid invite code. Please check the code and try again.');
      }
      // Handle expired code errors
      if (error.response?.status === 410) {
        throw new Error('This invite code has expired. Please request a new one.');
      }
      // Handle already member errors
      if (error.response?.status === 409) {
        throw new Error('You are already a member of this family tree.');
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
      throw new Error(error.message || 'Failed to join family tree');
    }
  },

  /**
   * Get all pending invitations for the current user
   * @returns {Promise<Array>} List of pending invitations
   */
  async getPendingInvitations() {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/invites/pending`, {
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
      throw new Error(error.message || 'Failed to fetch pending invitations');
    }
  },

  /**
   * Accept a pending invitation
   * @param {string} invitationId - Invitation ID
   * @returns {Promise<Object>} Accepted invitation result
   */
  async acceptInvitation(invitationId) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE_URL}/invites/${invitationId}/accept`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      });
    } catch (error) {
      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error('Invitation not found');
      }
      // Handle already processed errors
      if (error.response?.status === 409) {
        throw new Error('This invitation has already been processed');
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
      throw new Error(error.message || 'Failed to accept invitation');
    }
  },

  /**
   * Decline a pending invitation
   * @param {string} invitationId - Invitation ID
   * @returns {Promise<Object>} Declined invitation result
   */
  async declineInvitation(invitationId) {
    try {
      return await retryWithBackoff(async () => {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          `${API_BASE_URL}/invites/${invitationId}/decline`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      });
    } catch (error) {
      // Handle not found errors
      if (error.response?.status === 404) {
        throw new Error('Invitation not found');
      }
      // Handle already processed errors
      if (error.response?.status === 409) {
        throw new Error('This invitation has already been processed');
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
      throw new Error(error.message || 'Failed to decline invitation');
    }
  },
};

export default InviteService;
