import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * UserService handles all user profile-related API calls
 */
const UserService = {
  /**
   * Get user profile by ID
   */
  async getProfile(userId) {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Update user profile data
   */
  async updateProfile(data) {
    const token = localStorage.getItem('accessToken');
    const response = await axios.put(`${API_BASE_URL}/users/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Compress an image file before upload
   * @param {File} file - The image file to compress
   * @param {number} maxWidth - Maximum width in pixels (default: 800)
   * @param {number} maxHeight - Maximum height in pixels (default: 800)
   * @param {number} quality - JPEG quality 0-1 (default: 0.8)
   * @returns {Promise<Blob>} Compressed image blob
   */
  async compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  },

  /**
   * Upload profile photo with compression
   * Images are automatically compressed to max 800x800 pixels
   */
  async uploadPhoto(file) {
    const token = localStorage.getItem('accessToken');
    
    // Compress image before upload
    const compressedBlob = await this.compressImage(file);
    
    const formData = new FormData();
    formData.append('photo', compressedBlob, file.name);

    const response = await axios.post(`${API_BASE_URL}/users/photo`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.photoUrl;
  },
};

export default UserService;
