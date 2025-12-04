import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * AuthService handles all authentication-related API calls.
 * 
 * Security Note: Passwords are sent as plaintext to the backend API,
 * where they are hashed using bcrypt (≥10 salt rounds) before storage.
 * Password hashing MUST be done server-side for security.
 */
const AuthService = {
  /**
   * Register a new user with email and password
   * Backend will hash the password before storage
   */
  async register(email, password, fullName) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      email,
      password,
      fullName,
    });
    return response.data;
  },

  /**
   * Login with email and password
   * Backend will compare hashed password with stored hash
   */
  async login(email, password) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Login with Google OAuth
   */
  async loginWithGoogle(token) {
    const response = await axios.post(`${API_BASE_URL}/auth/google`, {
      token,
    });
    return response.data;
  },

  /**
   * Login with Apple Sign-In
   */
  async loginWithApple(token) {
    const response = await axios.post(`${API_BASE_URL}/auth/apple`, {
      token,
    });
    return response.data;
  },

  /**
   * Logout current user
   */
  async logout() {
    const token = localStorage.getItem('accessToken');
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  /**
   * Request password reset email
   */
  async requestPasswordReset(email) {
    await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      email,
    });
  },

  /**
   * Reset password with token
   * Backend will hash the new password before storage
   */
  async resetPassword(token, newPassword) {
    await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      newPassword,
    });
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });
    return response.data.accessToken;
  },
};

export default AuthService;
