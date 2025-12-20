import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import familyReducer from './slices/familySlice';
import memoryReducer from './slices/memorySlice';
import dashboardReducer from './slices/dashboardSlice';
import treeReducer from './slices/treeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    family: familyReducer,
    memory: memoryReducer,
    dashboard: dashboardReducer,
    tree: treeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for File objects in memory uploads
        ignoredActions: ['memory/uploadPhotos/pending', 'memory/uploadPhotos/fulfilled'],
        // Ignore these paths in the state for File objects
        ignoredPaths: ['memory.uploadingFiles'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
