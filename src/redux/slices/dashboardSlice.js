import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock mode for development
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

// Initial state
const initialState = {
  dashboardData: null,
  isLoading: false,
  error: null,
  sectionLoading: {
    recentUpdates: false,
    upcomingEvents: false,
    memorySpotlight: false,
    treeStats: false,
    onlineUsers: false,
  },
  sectionErrors: {
    recentUpdates: null,
    upcomingEvents: null,
    memorySpotlight: null,
    treeStats: null,
    onlineUsers: null,
  },
};

// Async thunks
export const loadDashboardData = createAsyncThunk(
  'dashboard/loadDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = {
          user: {
            id: 'mock-user-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            photoUrl: null,
          },
          recentUpdates: [],
          upcomingEvents: [],
          memorySpotlight: null,
          treeStats: {
            memberCount: 0,
            generationCount: 0,
          },
          onlineUsers: [],
        };
        return mockData;
      }

      // TODO: Implement actual API call
      // const data = await DashboardService.getDashboardData();
      // return data;
      
      throw new Error('Dashboard API not implemented');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load dashboard data');
    }
  }
);

export const refreshDashboard = createAsyncThunk(
  'dashboard/refreshDashboard',
  async (_, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = {
          user: {
            id: 'mock-user-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            photoUrl: null,
          },
          recentUpdates: [],
          upcomingEvents: [],
          memorySpotlight: null,
          treeStats: {
            memberCount: 0,
            generationCount: 0,
          },
          onlineUsers: [],
        };
        return mockData;
      }

      // TODO: Implement actual API call
      // const data = await DashboardService.getDashboardData();
      // return data;
      
      throw new Error('Dashboard API not implemented');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to refresh dashboard');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSectionError: (state, action) => {
      const { section, error } = action.payload;
      state.sectionErrors[section] = error;
    },
    clearSectionError: (state, action) => {
      const section = action.payload;
      state.sectionErrors[section] = null;
    },
  },
  extraReducers: (builder) => {
    // Load Dashboard Data
    builder
      .addCase(loadDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(loadDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Refresh Dashboard
    builder
      .addCase(refreshDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectDashboardData = (state) => state.dashboard.dashboardData;
export const selectDashboardLoading = (state) => state.dashboard.isLoading;
export const selectSectionLoading = (state, section) => state.dashboard.sectionLoading[section];
export const selectSectionError = (state, section) => state.dashboard.sectionErrors[section];

// Export actions and reducer
export const { setSectionError, clearSectionError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
