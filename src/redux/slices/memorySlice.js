import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import MemoryService from '../../services/MemoryService';

// Mock mode for development
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

// Initial state
const initialState = {
  memories: [],
  albums: [],
  isLoading: false,
  uploadProgress: 0,
  error: null,
};

// Async thunks
export const uploadPhotos = createAsyncThunk(
  'memory/uploadPhotos',
  async ({ files, memoryData, onProgress }, { dispatch, rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development with progress simulation
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          dispatch(setUploadProgress(i));
          if (onProgress) onProgress(i);
        }
        
        const photoUrls = files.map((file) => 
          URL.createObjectURL(file)
        );
        
        const newMemory = {
          id: 'mock-memory-' + Date.now(),
          uploadedBy: 'mock-user-id',
          albumId: memoryData.albumId || null,
          location: memoryData.location || null,
          dateTaken: memoryData.dateTaken || null,
          description: memoryData.description || null,
          photoUrls,
          taggedPeople: memoryData.taggedPeople || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        dispatch(setUploadProgress(100));
        return newMemory;
      }

      const result = await MemoryService.uploadPhotos(files, memoryData, (progress) => {
        dispatch(setUploadProgress(progress));
        if (onProgress) onProgress(progress);
      });
      
      dispatch(setUploadProgress(100));
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload photos');
    }
  }
);

export const createMemory = createAsyncThunk(
  'memory/createMemory',
  async (memoryData, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const newMemory = {
          id: 'mock-memory-' + Date.now(),
          uploadedBy: 'mock-user-id',
          ...memoryData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newMemory;
      }

      const newMemory = await MemoryService.createMemory(memoryData);
      return newMemory;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create memory');
    }
  }
);

export const getAlbums = createAsyncThunk(
  'memory/getAlbums',
  async (_, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockAlbums = [
          {
            id: 'mock-album-1',
            name: 'Family Gatherings',
            description: 'Special family moments',
            coverPhotoUrl: null,
            createdBy: 'mock-user-id',
            createdAt: new Date().toISOString(),
            photoCount: 0,
          },
          {
            id: 'mock-album-2',
            name: 'Holidays',
            description: 'Holiday celebrations',
            coverPhotoUrl: null,
            createdBy: 'mock-user-id',
            createdAt: new Date().toISOString(),
            photoCount: 0,
          },
        ];
        return mockAlbums;
      }

      const albumList = await MemoryService.getAlbums();
      return albumList;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch albums');
    }
  }
);

// Memory slice
const memorySlice = createSlice({
  name: 'memory',
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Photos
    builder
      .addCase(uploadPhotos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.memories.push(action.payload);
        state.error = null;
      })
      .addCase(uploadPhotos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      });

    // Create Memory
    builder
      .addCase(createMemory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMemory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.memories.push(action.payload);
        state.error = null;
      })
      .addCase(createMemory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Get Albums
    builder
      .addCase(getAlbums.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAlbums.fulfilled, (state, action) => {
        state.isLoading = false;
        state.albums = action.payload;
        state.error = null;
      })
      .addCase(getAlbums.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectMemories = (state) => state.memory.memories;
export const selectAlbums = (state) => state.memory.albums;
export const selectMemoryLoading = (state) => state.memory.isLoading;
export const selectUploadProgress = (state) => state.memory.uploadProgress;
export const selectMemoryError = (state) => state.memory.error;

// Export actions and reducer
export const { setUploadProgress, clearError } = memorySlice.actions;
export default memorySlice.reducer;
