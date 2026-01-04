# Implementation Plan: Context API to Redux Migration

- [x] 1. Setup Redux Infrastructure
  - [x] 1.1 Install Redux dependencies
    - Install @reduxjs/toolkit and react-redux packages
    - Verify installation in package.json
    - _Requirements: 1.1_
  
  - [x] 1.2 Create Redux store configuration
    - Create src/redux/store.js with configureStore
    - Configure middleware and DevTools
    - Add serializable check configuration for File objects
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 1.3 Wrap App with Redux Provider
    - Update src/main.jsx to include Redux Provider
    - Keep existing Context providers for backward compatibility
    - Verify store is accessible in components
    - _Requirements: 1.3_

- [x] 2. Create Auth Slice
  - [x] 2.1 Create authSlice with initial state and reducers
    - Create src/redux/slices/authSlice.js
    - Define initial state (user, isAuthenticated, isLoading, error)
    - Create clearError reducer
    - _Requirements: 2.1_
  
  - [x] 2.2 Create auth async thunks
    - Create signUp thunk with AuthService integration
    - Create signIn thunk with AuthService integration
    - Create signInWithGoogle thunk
    - Create signInWithApple thunk
    - Create signOut thunk with localStorage cleanup
    - Create resetPassword thunk
    - Create updatePassword thunk
    - Add mock mode support to all thunks
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [x] 2.3 Create auth selectors
    - Create selectUser selector
    - Create selectIsAuthenticated selector
    - Create selectAuthLoading selector
    - Create selectAuthError selector
    - Export all selectors
    - _Requirements: 2.1_
  
  - [x] 2.4 Write auth slice tests
    - Test initial state
    - Test each async thunk (pending/fulfilled/rejected)
    - Test clearError reducer
    - Test selectors
    - _Requirements: 9.2, 9.3, 9.4_

- [x] 3. Create User Slice
  - [x] 3.1 Create userSlice with initial state and reducers
    - Create src/redux/slices/userSlice.js
    - Define initial state (profile, isLoading, error)
    - Create clearError reducer
    - _Requirements: 3.1_
  
  - [x] 3.2 Create user async thunks
    - Create updateProfile thunk with UserService integration
    - Create uploadProfilePhoto thunk with progress tracking
    - Add mock mode support to all thunks
    - _Requirements: 3.2, 3.3, 3.5_
  
  - [x] 3.3 Create user selectors
    - Create selectProfile selector
    - Create selectProfileLoading selector
    - Create selectProfileError selector
    - Export all selectors
    - _Requirements: 3.1_
  
  - [x] 3.4 Write user slice tests
    - Test initial state
    - Test each async thunk
    - Test selectors
    - _Requirements: 9.2, 9.3, 9.4_

- [x] 4. Create Family Slice
  - [x] 4.1 Create familySlice with initial state and reducers
    - Create src/redux/slices/familySlice.js
    - Define initial state (familyMembers, relationships, isLoading, error)
    - Create clearError reducer
    - _Requirements: 4.1_
  
  - [x] 4.2 Create family async thunks
    - Create addFamilyMember thunk with FamilyService integration
    - Create updateFamilyMember thunk
    - Create getFamilyMembers thunk with forceRefresh support
    - Create getRelationships thunk with forceRefresh support
    - Add automatic relationship refresh after adding member
    - Add mock mode support to all thunks
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [x] 4.3 Create family selectors
    - Create selectFamilyMembers selector
    - Create selectRelationships selector
    - Create selectFamilyLoading selector
    - Create selectFamilyError selector
    - Create selectMemberById memoized selector
    - Export all selectors
    - _Requirements: 4.1_
  
  - [x] 4.4 Write family slice tests
    - Test initial state
    - Test each async thunk
    - Test relationship refresh logic
    - Test selectors including memoized ones
    - _Requirements: 9.2, 9.3, 9.4_

- [x] 5. Create Memory Slice
  - [x] 5.1 Create memorySlice with initial state and reducers
    - Create src/redux/slices/memorySlice.js
    - Define initial state (memories, albums, isLoading, uploadProgress, error)
    - Create setUploadProgress reducer
    - Create clearError reducer
    - _Requirements: 5.1_
  
  - [x] 5.2 Create memory async thunks
    - Create uploadPhotos thunk with progress tracking
    - Create createMemory thunk with MemoryService integration
    - Create getAlbums thunk
    - Add mock mode support to all thunks
    - _Requirements: 5.2, 5.3, 5.4, 5.7_
  
  - [x] 5.3 Create memory selectors
    - Create selectMemories selector
    - Create selectAlbums selector
    - Create selectMemoryLoading selector
    - Create selectUploadProgress selector
    - Create selectMemoryError selector
    - Export all selectors
    - _Requirements: 5.1, 5.6_
  
  - [x] 5.4 Write memory slice tests
    - Test initial state
    - Test each async thunk
    - Test upload progress updates
    - Test selectors
    - _Requirements: 9.2, 9.3, 9.4_

- [x] 6. Create Dashboard Slice
  - [x] 6.1 Create dashboardSlice with initial state and reducers
    - Create src/redux/slices/dashboardSlice.js
    - Define initial state (dashboardData, isLoading, error, sectionLoading, sectionErrors)
    - Create setSectionError reducer
    - Create clearSectionError reducer
    - _Requirements: 6.1_
  
  - [x] 6.2 Create dashboard async thunks
    - Create loadDashboardData thunk
    - Create refreshDashboard thunk
    - Add mock mode support to all thunks
    - _Requirements: 6.2, 6.3, 6.5_
  
  - [x] 6.3 Create dashboard selectors
    - Create selectDashboardData selector
    - Create selectDashboardLoading selector
    - Create selectSectionLoading selector with parameter
    - Create selectSectionError selector with parameter
    - Export all selectors
    - _Requirements: 6.1, 6.4_
  
  - [x] 6.4 Write dashboard slice tests
    - Test initial state
    - Test each async thunk
    - Test section error handling
    - Test selectors with parameters
    - _Requirements: 9.2, 9.3, 9.4_

- [x] 7. Create Tree Slice
  - [x] 7.1 Create treeSlice with initial state and reducers
    - Create src/redux/slices/treeSlice.js
    - Define initial state (selectedMemberId, searchQuery, searchResults, zoomLevel, panOffset, showFirstTimeTooltip)
    - Create all sync reducers (setSelectedMember, setSearchQuery, etc.)
    - Create performSearch reducer with filtering logic
    - Create resetTreeView reducer
    - Create dismissTooltip reducer with localStorage persistence
    - Create checkFirstTimeVisit reducer
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [x] 7.2 Create tree selectors
    - Create selectSelectedMemberId selector
    - Create selectSearchQuery selector
    - Create selectSearchResults selector
    - Create selectZoomLevel selector
    - Create selectPanOffset selector
    - Create selectShowTooltip selector
    - Export all selectors
    - _Requirements: 7.1_
  
  - [x] 7.3 Write tree slice tests
    - Test initial state
    - Test all reducers
    - Test search filtering logic
    - Test zoom level constraints (10-200%)
    - Test localStorage persistence for tooltip
    - Test selectors
    - _Requirements: 9.2, 9.4_

- [x] 8. Migrate Auth Components
  - [x] 8.1 Update SignUpPage to use Redux
    - Replace useAuth with useSelector and useDispatch
    - Update signUp call to dispatch action
    - Handle loading and error states from Redux
    - Test sign up flow
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 8.2 Update SignInPage to use Redux
    - Replace useAuth with useSelector and useDispatch
    - Update signIn call to dispatch action
    - Handle loading and error states from Redux
    - Test sign in flow
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 8.3 Update OAuth components to use Redux
    - Update Google sign-in to use Redux
    - Update Apple sign-in to use Redux
    - Test OAuth flows
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 8.4 Update password reset pages to use Redux
    - Update ForgotPasswordPage to use Redux
    - Update ResetPasswordPage to use Redux
    - Test password reset flow
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 8.5 Update ProtectedRoute to use Redux
    - Replace useAuth with useSelector
    - Check isAuthenticated from Redux state
    - Test route protection
    - _Requirements: 8.1, 8.4_

- [x] 9. Migrate User Components
  - [x] 9.1 Update ProfileSetupPage to use Redux
    - Replace useUser with useSelector and useDispatch
    - Update updateProfile call to dispatch action
    - Update uploadProfilePhoto call to dispatch action
    - Handle loading and error states from Redux
    - Test profile setup flow
    - _Requirements: 8.1, 8.2, 8.4_

- [x] 10. Migrate Family Components
  - [x] 10.1 Update FamilyTreePage to use Redux
    - Replace useFamily with useSelector and useDispatch
    - Update getFamilyMembers call to dispatch action
    - Update getRelationships call to dispatch action
    - Update addFamilyMember call to dispatch action
    - Handle loading and error states from Redux
    - Test family tree display and interactions
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 10.2 Update AddRelativeModal to use Redux
    - Update to dispatch addFamilyMember action
    - Handle submission with Redux
    - Test modal functionality
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 10.3 Update AddFamilyMemberPage to use Redux
    - Replace useFamily with useSelector and useDispatch
    - Update addFamilyMember call to dispatch action
    - Test add family member flow
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 10.4 Update MemberDetailPanel to use Redux
    - Replace useFamily with useSelector
    - Use selectMemberById for member data
    - Test member detail display
    - _Requirements: 8.1, 8.3, 8.4_

- [x] 11. Migrate Memory Components
  - [x] 11.1 Update UploadPhotosPage to use Redux
    - Replace useMemory with useSelector and useDispatch
    - Update uploadPhotos call to dispatch action
    - Update getAlbums call to dispatch action
    - Handle upload progress from Redux
    - Handle loading and error states from Redux
    - Test photo upload flow
    - _Requirements: 8.1, 8.2, 8.4_

- [x] 12. Migrate Dashboard Components
  - [x] 12.1 Update DashboardPage to use Redux
    - Replace useDashboard with useSelector and useDispatch
    - Update loadDashboardData call to dispatch action
    - Handle section loading states from Redux
    - Handle section errors from Redux
    - Test dashboard display
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 12.2 Update dashboard section components
    - Update RecentUpdates to use Redux
    - Update UpcomingEvents to use Redux
    - Update MemorySpotlight to use Redux
    - Update TreeStatistics to use Redux
    - Update OnlineNow to use Redux
    - Test each section independently
    - _Requirements: 8.1, 8.4_

- [x] 13. Migrate Tree UI Components
  - [x] 13.1 Update TreeCanvas to use Redux
    - Replace useTree with useSelector and useDispatch
    - Update zoom controls to dispatch actions
    - Update pan controls to dispatch actions
    - Update member selection to dispatch actions
    - Test tree interactions
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 13.2 Update ZoomControls to use Redux
    - Replace useTree with useSelector and useDispatch
    - Update zoom in/out to dispatch actions
    - Update reset to dispatch action
    - Test zoom controls
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 13.3 Update SearchInput to use Redux
    - Replace useTree with useSelector and useDispatch
    - Update search to dispatch action
    - Display search results from Redux
    - Test search functionality
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [x] 13.4 Update FirstTimeTooltip to use Redux
    - Replace useTree with useSelector and useDispatch
    - Update dismiss to dispatch action
    - Test tooltip display and dismissal
    - _Requirements: 8.1, 8.2, 8.4_

- [x] 14. Cleanup and Remove Context API
  - [x] 14.1 Remove Context providers from App.jsx
    - Remove AuthProvider wrapper
    - Remove UserProvider wrapper
    - Remove FamilyProvider wrapper
    - Remove MemoryProvider wrapper
    - Remove DashboardProvider wrapper
    - Remove TreeProvider wrapper
    - Keep only Redux Provider
    - _Requirements: 8.5_
  
  - [x] 14.2 Delete Context files
    - Delete src/contexts/AuthContext.jsx
    - Delete src/contexts/UserContext.jsx
    - Delete src/contexts/FamilyContext.jsx
    - Delete src/contexts/MemoryContext.jsx
    - Delete src/contexts/DashboardContext.jsx
    - Delete src/contexts/TreeContext.jsx
    - Delete src/contexts/hi.rtf
    - _Requirements: 8.5_
  
  - [x] 14.3 Delete Context test files
    - Delete src/contexts/AuthContext.test.jsx
    - Delete src/contexts/UserContext.test.jsx
    - _Requirements: 8.5_

- [x] 15. Update Documentation
  - [x] 15.1 Update DOCUMENTATION.md
    - Replace Context API architecture with Redux architecture
    - Update state management section
    - Add Redux store structure
    - Add Redux DevTools usage
    - Remove Context API references
    - _Requirements: 10.1_
  
  - [x] 15.2 Update COMPONENT_GUIDE.md
    - Replace useContext examples with useSelector/useDispatch
    - Update component usage examples
    - Add Redux hook patterns
    - Remove Context provider examples
    - _Requirements: 10.2_
  
  - [x] 15.3 Update API_AND_DATA_GUIDE.md
    - Add Redux state structure section
    - Document all slices and their state shape
    - Document async thunks and their usage
    - Document selectors
    - Remove Context API references
    - _Requirements: 10.3_
  
  - [x] 15.4 Create REDUX_GUIDE.md
    - Document Redux Toolkit setup
    - Document slice creation patterns
    - Document async thunk patterns
    - Document selector patterns
    - Document testing strategies
    - Add best practices
    - Add common patterns and examples
    - _Requirements: 10.4_

- [x] 16. Final Testing and Validation
  - [x] 16.1 Run all existing tests
    - Run npm test
    - Verify all tests pass
    - Fix any failing tests
    - _Requirements: 9.1_
  
  - [x] 16.2 Manual testing of all features
    - Test authentication flows (sign up, sign in, sign out)
    - Test profile setup and updates
    - Test family tree operations (add, update, view)
    - Test photo upload and memory creation
    - Test dashboard display
    - Test tree UI interactions (zoom, pan, search, select)
    - Verify mock mode works correctly
    - _Requirements: 9.5_
  
  - [x] 16.3 Performance testing
    - Check for unnecessary re-renders
    - Verify selector memoization
    - Test with large family trees
    - Optimize if needed
    - _Requirements: 9.5_
  
  - [x] 16.4 Browser testing
    - Test in Chrome
    - Test in Firefox
    - Test in Safari
    - Test in Edge
    - Verify Redux DevTools work
    - _Requirements: 9.5_

- [x] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
