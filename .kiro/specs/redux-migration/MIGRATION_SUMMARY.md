# Redux Migration Summary

## Overview

This spec outlines a complete migration from React Context API to Redux Toolkit for the Roots family tree application. The migration will improve state management, debugging capabilities, and scalability while maintaining all existing functionality.

## What's Being Migrated

### 6 Context APIs → 6 Redux Slices

1. **AuthContext** → **authSlice**
   - User authentication state
   - Sign up, sign in, OAuth, sign out
   - Password reset functionality

2. **UserContext** → **userSlice**
   - User profile management
   - Profile updates and photo uploads

3. **FamilyContext** → **familySlice**
   - Family members and relationships
   - Add, update, fetch operations
   - Most complex slice with relationship management

4. **MemoryContext** → **memorySlice**
   - Photo memories and albums
   - Upload with progress tracking
   - Album management

5. **DashboardContext** → **dashboardSlice**
   - Dashboard data aggregation
   - Section-specific loading and errors
   - Refresh functionality

6. **TreeContext** → **treeSlice**
   - Tree UI state (zoom, pan, selection)
   - Search functionality
   - First-time tooltip management

## Key Benefits

✅ **Centralized State** - Single source of truth in Redux store
✅ **Better Debugging** - Redux DevTools for time-travel debugging
✅ **Improved Performance** - Memoized selectors prevent unnecessary re-renders
✅ **Easier Testing** - Slices are pure functions, easy to unit test
✅ **Scalability** - Better structure for growing application
✅ **Type Safety** - Better TypeScript support (if migrating later)

## Migration Approach

### Incremental Migration (Safe)
- Redux and Context coexist during migration
- Migrate one slice at a time
- Test thoroughly after each slice
- Remove Context only when all components migrated
- **Estimated Time:** 3-4 weeks

### File Structure

```
src/
├── redux/
│   ├── store.js                    # Redux store configuration
│   └── slices/
│       ├── authSlice.js           # Auth state management
│       ├── userSlice.js           # User profile management
│       ├── familySlice.js         # Family tree data
│       ├── memorySlice.js         # Photos and memories
│       ├── dashboardSlice.js      # Dashboard data
│       └── treeSlice.js           # Tree UI state
├── contexts/                       # TO BE DELETED after migration
│   ├── AuthContext.jsx
│   ├── UserContext.jsx
│   ├── FamilyContext.jsx
│   ├── MemoryContext.jsx
│   ├── DashboardContext.jsx
│   └── TreeContext.jsx
└── components/                     # All components updated to use Redux
```

## Implementation Phases

### Phase 1: Setup (Week 1)
- Install Redux Toolkit and React-Redux
- Create store configuration
- Wrap App with Redux Provider
- Keep Context providers for backward compatibility

### Phase 2: Create Slices (Week 1-2)
- Create all 6 slices with reducers
- Create async thunks for API calls
- Create selectors for state access
- Write unit tests for each slice

### Phase 3: Migrate Components (Week 2-3)
- Update components to use Redux hooks
- Replace `useContext` with `useSelector` and `useDispatch`
- Test each component after migration
- Migrate in this order:
  1. Auth components (SignUp, SignIn, etc.)
  2. User components (ProfileSetup)
  3. Family components (FamilyTree, AddMember)
  4. Memory components (UploadPhotos)
  5. Dashboard components
  6. Tree UI components

### Phase 4: Cleanup (Week 3)
- Remove all Context providers from App.jsx
- Delete Context files
- Update all documentation
- Final testing

### Phase 5: Optimization (Week 4)
- Add memoized selectors with Reselect
- Optimize component re-renders
- Performance testing
- Add Redux persist (optional)

## Code Changes Example

### Before (Context API)
```javascript
// Component using Context
import { useAuth } from '../contexts/AuthContext';

function SignInPage() {
  const { signIn, isLoading, error } = useAuth();
  
  const handleSubmit = async () => {
    await signIn(email, password);
  };
  
  return (
    <div>
      {isLoading && <Spinner />}
      {error && <Error message={error} />}
      <button onClick={handleSubmit}>Sign In</button>
    </div>
  );
}
```

### After (Redux)
```javascript
// Component using Redux
import { useSelector, useDispatch } from 'react-redux';
import { signIn, selectAuthLoading, selectAuthError } from '../redux/slices/authSlice';

function SignInPage() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const handleSubmit = async () => {
    await dispatch(signIn({ email, password })).unwrap();
  };
  
  return (
    <div>
      {isLoading && <Spinner />}
      {error && <Error message={error} />}
      <button onClick={handleSubmit}>Sign In</button>
    </div>
  );
}
```

## Testing Strategy

### Unit Tests
- Test each slice's reducers
- Test async thunks with mocked services
- Test selectors return correct values

### Integration Tests
- Test component integration with Redux
- Test complete user flows
- Test error handling

### Manual Testing
- Test all features in browser
- Verify mock mode works
- Test Redux DevTools
- Performance testing

## Mock Mode Support

All slices will maintain mock mode support:
```javascript
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export const getFamilyMembers = createAsyncThunk(
  'family/getFamilyMembers',
  async (forceRefresh, { rejectWithValue }) => {
    if (MOCK_MODE) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return []; // Mock data
    }
    return await FamilyService.getFamilyMembers();
  }
);
```

## Documentation Updates

All documentation will be updated:
- **DOCUMENTATION.md** - Redux architecture
- **COMPONENT_GUIDE.md** - Redux hook usage
- **API_AND_DATA_GUIDE.md** - Redux state structure
- **REDUX_GUIDE.md** - New guide with best practices

## Risk Mitigation

### Risks
1. Breaking existing functionality
2. Performance regressions
3. Incomplete migration leaving mixed state management

### Mitigation
1. Incremental migration with thorough testing
2. Performance benchmarks before and after
3. Clear migration checklist and validation
4. Keep Context as fallback during migration

## Success Criteria

✅ All Context providers removed
✅ All components using Redux hooks
✅ All tests passing
✅ No console errors
✅ Redux DevTools working
✅ Mock mode functioning
✅ Documentation updated
✅ Performance maintained or improved

## Next Steps

1. **Review this spec** - Ensure requirements and design meet your needs
2. **Approve migration** - Give go-ahead to start implementation
3. **Begin Phase 1** - Install dependencies and setup store
4. **Incremental execution** - Follow task list step by step

## Questions to Consider

Before starting, consider:
- Do you want to migrate all at once or incrementally?
- Should we add Redux persist for offline support?
- Do you want TypeScript migration at the same time?
- Any specific performance concerns?
- Timeline constraints?

---

**Ready to proceed?** Review the requirements.md, design.md, and tasks.md files, then let me know if you'd like to start the migration!
