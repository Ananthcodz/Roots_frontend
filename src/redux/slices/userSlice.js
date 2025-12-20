import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserService from '../../services/UserService';

// Mock mode for development
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

// Initial state
const initialState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedProfile = {
          ...data,
          userId: 'mock-user-id',
          isComplete: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return updatedProfile;
      }
      
      const updatedProfile = await UserService.updateProfile(data);
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'user/uploadProfilePhoto',
  async (file, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const photoUrl = URL.createObjectURL(file);
        return photoUrl;
      }
      
      const photoUrl = await UserService.uploadPhoto(file);
      return photoUrl;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photo');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Upload Profile Photo
    builder
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.photoUrl = action.payload;
        } else {
          state.profile = { photoUrl: action.payload };
        }
        state.error = null;
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProfile = (state) => state.user.profile;
export const selectProfileLoading = (state) => state.user.isLoading;
export const selectProfileError = (state) => state.user.error;

// Export actions and reducer
export const { clearError } = userSlice.actions;
export default userSlice.reducer;
