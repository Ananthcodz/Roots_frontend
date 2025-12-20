# Design Document: Context API to Redux Migration

## Overview

This document outlines the technical design for migrating the Roots application from React Context API to Redux Toolkit. The migration will maintain all existing functionality while providing better state management, debugging capabilities, and scalability.

## Architecture

### Current Architecture (Context API)
```
App.jsx
├─> AuthProvider
│   ├─> UserProvider
│   │   ├─> FamilyProvider
│   │   │   ├─> MemoryProvider
│   │   │   │   ├─> DashboardProvider
│   │   │   │   │   └─> Routes & Components
```

### New Architecture (Redux)
```
App.jsx
├─> Redux Provider (store)
│   └─> Routes & Components
│       └─> useSelector / useDispatch hooks

Redux Store
├─> authSlice
├─> userSlice
├─> familySlice
├─> memorySlice
├─> dashboardSlice
└─> treeSlice
```

## Components and Interfaces

### 1. Redux Store Configuration

**File:** `src/redux/store.js`

```javascript
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
        // Ignore these action types for File objects
        ignoredActions: ['memory/uploadPhotos/pending'],
        // Ignore these paths in the state
        ignoredPaths: ['memory.uploadingFiles'],
      },
    }),
});
```

### 2. Auth Slice

**File:** `src/redux/slices/authSlice.js`

**State Shape:**
```javascript
{
  user: null | {
    id: string,
    email: string,
    fullName: string,
    authProvider: string,
    createdAt: string,
    lastLoginAt: string,
    emailVerified: boolean
  },
  isAuthenticated: boolean,
  isLoading: boolean,
  error: null | string
}
```

**Actions:**
- `signUp(email, password, fullName)` - Async thunk
- `signIn(email, password)` - Async thunk
- `signInWithGoogle()` - Async thunk
- `signInWithApple()` - Async thunk
- `signOut()` - Async thunk
- `resetPassword(email)` - Async thunk
- `updatePassword(token, newPassword)` - Async thunk
- `clearError()` - Sync action

**Selectors:**
- `selectUser(state)` - Returns current user
- `selectIsAuthenticated(state)` - Returns auth status
- `selectAuthLoading(state)` - Returns loading state
- `selectAuthError(state)` - Returns error message

### 3. User Slice

**File:** `src/redux/slices/userSlice.js`

**State Shape:**
```javascript
{
  profile: null | {
    userId: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    photoUrl: string,
    bio: string,
    location: string,
    isComplete: boolean
  },
  isLoading: boolean,
  error: null | string
}
```

**Actions:**
- `updateProfile(data)` - Async thunk
- `uploadProfilePhoto(file)` - Async thunk
- `clearError()` - Sync action

**Selectors:**
- `selectProfile(state)` - Returns user profile
- `selectProfileLoading(state)` - Returns loading state
- `selectProfileError(state)` - Returns error message

### 4. Family Slice

**File:** `src/redux/slices/familySlice.js`

**State Shape:**
```javascript
{
  familyMembers: [],
  relationships: [],
  isLoading: boolean,
  error: null | string
}
```

**Actions:**
- `addFamilyMember(memberData)` - Async thunk
- `updateFamilyMember({ memberId, memberData })` - Async thunk
- `getFamilyMembers(forceRefresh)` - Async thunk
- `getRelationships(forceRefresh)` - Async thunk
- `clearError()` - Sync action

**Selectors:**
- `selectFamilyMembers(state)` - Returns all family members
- `selectRelationships(state)` - Returns all relationships
- `selectFamilyLoading(state)` - Returns loading state
- `selectFamilyError(state)` - Returns error message
- `selectMemberById(state, memberId)` - Returns specific member

### 5. Memory Slice

**File:** `src/redux/slices/memorySlice.js`

**State Shape:**
```javascript
{
  memories: [],
  albums: [],
  isLoading: boolean,
  uploadProgress: 0,
  error: null | string
}
```

**Actions:**
- `uploadPhotos({ files, memoryData, onProgress })` - Async thunk
- `createMemory(memoryData)` - Async thunk
- `getAlbums()` - Async thunk
- `setUploadProgress(progress)` - Sync action
- `clearError()` - Sync action

**Selectors:**
- `selectMemories(state)` - Returns all memories
- `selectAlbums(state)` - Returns all albums
- `selectMemoryLoading(state)` - Returns loading state
- `selectUploadProgress(state)` - Returns upload progress
- `selectMemoryError(state)` - Returns error message

### 6. Dashboard Slice

**File:** `src/redux/slices/dashboardSlice.js`

**State Shape:**
```javascript
{
  dashboardData: null | {
    user: object,
    recentUpdates: [],
    upcomingEvents: [],
    memorySpotlight: object,
    treeStats: object,
    onlineUsers: []
  },
  isLoading: boolean,
  error: null | string,
  sectionLoading: {
    recentUpdates: boolean,
    upcomingEvents: boolean,
    memorySpotlight: boolean,
    treeStats: boolean,
    onlineUsers: boolean
  },
  sectionErrors: {
    recentUpdates: null | string,
    upcomingEvents: null | string,
    memorySpotlight: null | string,
    treeStats: null | string,
    onlineUsers: null | string
  }
}
```

**Actions:**
- `loadDashboardData()` - Async thunk
- `refreshDashboard()` - Async thunk
- `setSectionError({ section, error })` - Sync action
- `clearSectionError(section)` - Sync action

**Selectors:**
- `selectDashboardData(state)` - Returns dashboard data
- `selectDashboardLoading(state)` - Returns loading state
- `selectSectionLoading(state, section)` - Returns section loading state
- `selectSectionError(state, section)` - Returns section error

### 7. Tree Slice

**File:** `src/redux/slices/treeSlice.js`

**State Shape:**
```javascript
{
  selectedMemberId: null | string,
  searchQuery: string,
  searchResults: [],
  zoomLevel: 100,
  panOffset: { x: 0, y: 0 },
  showFirstTimeTooltip: boolean
}
```

**Actions:**
- `setSelectedMember(memberId)` - Sync action
- `setSearchQuery(query)` - Sync action
- `performSearch({ query, members })` - Sync action
- `setZoomLevel(level)` - Sync action
- `zoomIn()` - Sync action
- `zoomOut()` - Sync action
- `setPanOffset({ x, y })` - Sync action
- `resetTreeView()` - Sync action
- `dismissTooltip()` - Sync action
- `checkFirstTimeVisit()` - Sync action

**Selectors:**
- `selectSelectedMemberId(state)` - Returns selected member ID
- `selectSearchQuery(state)` - Returns search query
- `selectSearchResults(state)` - Returns search results
- `selectZoomLevel(state)` - Returns zoom level
- `selectPanOffset(state)` - Returns pan offset
- `selectShowTooltip(state)` - Returns tooltip visibility

## Data Models

### Redux State Tree
```javascript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  user: {
    profile: Profile | null,
    isLoading: boolean,
    error: string | null
  },
  family: {
    familyMembers: FamilyMember[],
    relationships: Relationship[],
    isLoading: boolean,
    error: string | null
  },
  memory: {
    memories: Memory[],
    albums: Album[],
    isLoading: boolean,
    uploadProgress: number,
    error: string | null
  },
  dashboard: {
    dashboardData: DashboardData | null,
    isLoading: boolean,
    error: string | null,
    sectionLoading: SectionLoading,
    sectionErrors: SectionErrors
  },
  tree: {
    selectedMemberId: string | null,
    searchQuery: string,
    searchResults: string[],
    zoomLevel: number,
    panOffset: { x: number, y: number },
    showFirstTimeTooltip: boolean
  }
}
```

## Error Handling

### Async Thunk Error Handling
```javascript
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to sign in');
    }
  }
);
```

### Component Error Handling
```javascript
const dispatch = useDispatch();
const error = useSelector(selectAuthError);

const handleSignIn = async () => {
  try {
    await dispatch(signIn({ email, password })).unwrap();
    navigate('/dashboard');
  } catch (err) {
    // Error is already in Redux state
    console.error('Sign in failed:', err);
  }
};
```

## Testing Strategy

### Unit Tests for Slices
- Test initial state
- Test each reducer action
- Test async thunk pending/fulfilled/rejected states
- Test selectors return correct values

### Integration Tests
- Test component integration with Redux
- Test async thunk API calls with mocked services
- Test error handling flows
- Test mock mode functionality

### Example Test Structure
```javascript
describe('authSlice', () => {
  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  });

  it('should handle signIn.pending', () => {
    const actual = authReducer(initialState, signIn.pending());
    expect(actual.isLoading).toBe(true);
  });

  it('should handle signIn.fulfilled', () => {
    const user = { id: '1', email: 'test@test.com' };
    const actual = authReducer(initialState, signIn.fulfilled(user));
    expect(actual.user).toEqual(user);
    expect(actual.isAuthenticated).toBe(true);
  });
});
```

## Migration Strategy

### Phase 1: Setup (Week 1)
1. Install Redux Toolkit and React-Redux
2. Create store configuration
3. Wrap App with Redux Provider
4. Keep Context providers temporarily for backward compatibility

### Phase 2: Slice Creation (Week 1-2)
1. Create all 6 slices with reducers and actions
2. Create async thunks for API calls
3. Create selectors for each slice
4. Write unit tests for slices

### Phase 3: Component Migration (Week 2-3)
1. Update components one slice at a time
2. Replace useContext with useSelector/useDispatch
3. Test each component after migration
4. Keep Context as fallback during migration

### Phase 4: Cleanup (Week 3)
1. Remove all Context providers
2. Delete Context files
3. Update all documentation
4. Final testing and validation

### Phase 5: Optimization (Week 4)
1. Add memoized selectors with Reselect
2. Optimize re-renders with React.memo
3. Add Redux persist for offline support
4. Performance testing and optimization

## Performance Considerations

### Selector Memoization
```javascript
import { createSelector } from '@reduxjs/toolkit';

export const selectFamilyMembersArray = createSelector(
  [selectFamilyMembers],
  (members) => Object.values(members)
);
```

### Component Optimization
```javascript
// Use shallow equality for arrays/objects
const familyMembers = useSelector(selectFamilyMembers, shallowEqual);

// Memoize components that receive Redux state
export default React.memo(FamilyTreePage);
```

## Mock Mode Support

All slices will check `import.meta.env.VITE_MOCK_API` and provide mock responses when enabled:

```javascript
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export const getFamilyMembers = createAsyncThunk(
  'family/getFamilyMembers',
  async (forceRefresh, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return [];
      }
      return await FamilyService.getFamilyMembers();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## DevTools Integration

Redux DevTools will be automatically enabled in development:
- Time-travel debugging
- Action history
- State inspection
- Action replay

## Backward Compatibility

During migration, both Context and Redux will coexist:
1. New components use Redux
2. Old components continue using Context
3. Gradual migration component by component
4. Final cleanup removes all Context code
