# API & Data Structure Guide - Roots Application

## Table of Contents
1. [Data Models](#data-models)
2. [Redux State Structure](#redux-state-structure)
3. [Redux Slices](#redux-slices)
4. [API Endpoints](#api-endpoints)
5. [Services](#services)
6. [Mock Data](#mock-data)
7. [Error Handling](#error-handling)

---

## Data Models

### User Model
**Purpose**: Represents an authenticated user

**Structure**:
```javascript
{
  id: String,                    // Unique identifier
  email: String,                 // User email
  firstName: String,             // First name
  lastName: String,              // Last name
  photoUrl: String,              // Profile photo URL
  dateOfBirth: String,           // ISO date string
  gender: 'male' | 'female' | 'other',
  bio: String,                   // User bio
  createdAt: String,             // ISO timestamp
  updatedAt: String              // ISO timestamp
}
```

**Example**:
```javascript
{
  id: "user-123",
  email: "alex@example.com",
  firstName: "Alex",
  lastName: "Rivera",
  photoUrl: "https://example.com/photo.jpg",
  dateOfBirth: "1995-01-15",
  gender: "male",
  bio: "Family tree enthusiast",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-12-19T10:30:00Z"
}
```

---

### Family Member Model
**Purpose**: Represents a person in the family tree

**Structure**:
```javascript
{
  id: String,                    // Unique identifier
  userId: String,                // Associated user ID (null if not a user)
  firstName: String,             // First name
  lastName: String,              // Last name
  photoUrl: String,              // Photo URL
  dateOfBirth: String,           // ISO date string
  gender: 'male' | 'female' | 'other',
  status: 'living' | 'deceased', // Life status
  specificLabel: String,         // Custom label (e.g., "Grandmother")
  createdBy: String,             // User ID who added this member
  createdAt: String,             // ISO timestamp
  updatedAt: String              // ISO timestamp
}
```

**Example**:
```javascript
{
  id: "member-456",
  userId: null,
  firstName: "Maria",
  lastName: "Rivera",
  photoUrl: "https://example.com/maria.jpg",
  dateOfBirth: "1970-05-20",
  gender: "female",
  status: "living",
  specificLabel: "Mother",
  createdBy: "user-123",
  createdAt: "2024-01-15T00:00:00Z",
  updatedAt: "2024-12-19T10:30:00Z"
}
```

---

### Relationship Model
**Purpose**: Represents connections between family members

**Structure**:
```javascript
{
  id: String,                    // Unique identifier
  fromUserId: String,            // Source member ID
  toUserId: String,              // Target member ID
  relationshipType: String,      // Type of relationship
  specificLabel: String,         // Custom label
  createdAt: String              // ISO timestamp
}
```

**Relationship Types**:
- `parent` - fromUser is parent of toUser
- `child` - fromUser is child of toUser
- `spouse` - Bidirectional spouse relationship
- `sibling` - Bidirectional sibling relationship
- `grandparent` - fromUser is grandparent of toUser
- `grandchild` - fromUser is grandchild of toUser

**Example**:
```javascript
{
  id: "rel-789",
  fromUserId: "member-456",
  toUserId: "user-123",
  relationshipType: "parent",
  specificLabel: null,
  createdAt: "2024-01-15T00:00:00Z"
}
```

---

### Event Model
**Purpose**: Represents family events

**Structure**:
```javascript
{
  id: String,                    // Unique identifier
  title: String,                 // Event title
  description: String,           // Event description
  category: String,              // Event category
  date: String,                  // ISO date string
  time: String,                  // Time in HH:MM format
  location: String,              // Event location
  imageUrl: String,              // Event image
  createdBy: String,             // User ID who created event
  attendees: Array,              // Array of attendee IDs
  invitedGuests: Array,          // Array of invited guest objects
  status: 'pending' | 'upcoming' | 'past',
  createdAt: String,             // ISO timestamp
  updatedAt: String              // ISO timestamp
}
```

**Categories**:
- `Celebration` - Birthday, anniversary, etc.
- `Reunion` - Family gathering
- `Dinner` - Family dinner
- `Trip` - Family vacation
- `Memorial` - Memorial event

**Example**:
```javascript
{
  id: "event-101",
  title: "Family Reunion 2024",
  description: "Annual family gathering",
  category: "Reunion",
  date: "2024-07-15",
  time: "14:00",
  location: "Central Park, New York",
  imageUrl: "https://example.com/reunion.jpg",
  createdBy: "user-123",
  attendees: ["user-123", "member-456"],
  invitedGuests: [
    {
      id: "guest-1",
      name: "John Doe",
      email: "john@example.com",
      status: "pending"
    }
  ],
  status: "upcoming",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-12-19T10:30:00Z"
}
```

---

### Photo Model
**Purpose**: Represents family photos

**Structure**:
```javascript
{
  id: String,                    // Unique identifier
  url: String,                   // Photo URL
  title: String,                 // Photo title
  description: String,           // Photo description
  uploadedBy: String,            // User ID who uploaded
  membersTagged: Array,          // Array of tagged member IDs
  date: String,                  // ISO date string
  album: String,                 // Album name
  createdAt: String,             // ISO timestamp
  updatedAt: String              // ISO timestamp
}
```

---

## Redux State Structure

### Complete Redux State Tree

The Redux store contains all global application state organized into slices:

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
    sectionLoading: Object,
    sectionErrors: Object
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

### Accessing Redux State

**Using Selectors** (recommended):
```javascript
import { useSelector } from 'react-redux';
import { selectFamilyMembers } from '../redux/slices/familySlice';

function MyComponent() {
  const familyMembers = useSelector(selectFamilyMembers);
  // Use familyMembers in component
}
```

**Direct State Access** (not recommended):
```javascript
const familyMembers = useSelector(state => state.family.familyMembers);
```

---

## Redux Slices

All Redux slices follow a consistent pattern with state, async thunks, sync actions, and selectors.

### Auth Slice
**File**: `src/redux/slices/authSlice.js`

**Async Thunks**:
- `signUp({ email, password, fullName })` - Register new user
- `signIn({ email, password })` - User login
- `signInWithGoogle()` - Google OAuth login
- `signInWithApple()` - Apple OAuth login
- `signOut()` - User logout
- `resetPassword(email)` - Send password reset email
- `updatePassword({ token, newPassword })` - Update password

**Selectors**:
- `selectUser(state)` - Get current user
- `selectIsAuthenticated(state)` - Get auth status
- `selectAuthLoading(state)` - Get loading state
- `selectAuthError(state)` - Get error message

### User Slice
**File**: `src/redux/slices/userSlice.js`

**Async Thunks**:
- `updateProfile(profileData)` - Update user profile
- `uploadProfilePhoto(file)` - Upload profile photo

**Selectors**:
- `selectProfile(state)` - Get user profile
- `selectProfileLoading(state)` - Get loading state
- `selectProfileError(state)` - Get error message

### Family Slice
**File**: `src/redux/slices/familySlice.js`

**Async Thunks**:
- `addFamilyMember(memberData)` - Add new family member
- `updateFamilyMember({ memberId, memberData })` - Update member
- `getFamilyMembers(forceRefresh)` - Fetch all members
- `getRelationships(forceRefresh)` - Fetch all relationships

**Selectors**:
- `selectFamilyMembers(state)` - Get all family members
- `selectRelationships(state)` - Get all relationships
- `selectFamilyLoading(state)` - Get loading state
- `selectFamilyError(state)` - Get error message
- `selectMemberById(state, memberId)` - Get specific member (memoized)

### Memory Slice
**File**: `src/redux/slices/memorySlice.js`

**Async Thunks**:
- `uploadPhotos({ files, memoryData, onProgress })` - Upload photos
- `createMemory(memoryData)` - Create memory
- `getAlbums()` - Fetch albums

**Selectors**:
- `selectMemories(state)` - Get memories
- `selectAlbums(state)` - Get albums
- `selectMemoryLoading(state)` - Get loading state
- `selectUploadProgress(state)` - Get upload progress
- `selectMemoryError(state)` - Get error message

### Dashboard Slice
**File**: `src/redux/slices/dashboardSlice.js`

**Async Thunks**:
- `loadDashboardData()` - Load dashboard data
- `refreshDashboard()` - Refresh dashboard

**Selectors**:
- `selectDashboardData(state)` - Get dashboard data
- `selectDashboardLoading(state)` - Get loading state
- `selectSectionLoading(state, section)` - Get section loading
- `selectSectionError(state, section)` - Get section error

### Tree Slice
**File**: `src/redux/slices/treeSlice.js`

**Sync Actions**:
- `setSelectedMember(memberId)` - Set selected member
- `setSearchQuery(query)` - Set search query
- `performSearch({ query, members })` - Perform search
- `setZoomLevel(level)` - Set zoom level
- `zoomIn()` / `zoomOut()` - Zoom controls
- `setPanOffset({ x, y })` - Set pan offset
- `resetTreeView()` - Reset view
- `dismissTooltip()` - Dismiss tooltip
- `checkFirstTimeVisit()` - Check first visit

**Selectors**:
- `selectSelectedMemberId(state)` - Get selected member
- `selectSearchQuery(state)` - Get search query
- `selectSearchResults(state)` - Get search results
- `selectZoomLevel(state)` - Get zoom level
- `selectPanOffset(state)` - Get pan offset
- `selectShowTooltip(state)` - Get tooltip visibility

---

## API Endpoints

### Authentication Endpoints

#### POST /auth/signup
**Purpose**: Register new user

**Request**:
```javascript
{
  email: String,
  password: String,
  firstName: String,
  lastName: String
}
```

**Response**:
```javascript
{
  success: Boolean,
  user: User,
  token: String
}
```

---

#### POST /auth/login
**Purpose**: User login

**Request**:
```javascript
{
  email: String,
  password: String
}
```

**Response**:
```javascript
{
  success: Boolean,
  user: User,
  token: String
}
```

---

#### POST /auth/logout
**Purpose**: User logout

**Response**:
```javascript
{
  success: Boolean
}
```

---

### Family Member Endpoints

#### GET /api/family/members
**Purpose**: Get all family members

**Query Parameters**:
- `treeId` (optional) - Filter by tree

**Response**:
```javascript
{
  success: Boolean,
  members: Array<FamilyMember>
}
```

---

#### POST /api/family/members
**Purpose**: Add new family member

**Request**:
```javascript
{
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  gender: String,
  status: String,
  specificLabel: String,
  photoUrl: String,
  relatedTo: String,           // Member ID to relate to
  relationshipType: String     // Type of relationship
}
```

**Response**:
```javascript
{
  success: Boolean,
  member: FamilyMember
}
```

---

#### PUT /api/family/members/:id
**Purpose**: Update family member

**Request**:
```javascript
{
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  gender: String,
  status: String,
  specificLabel: String,
  photoUrl: String
}
```

**Response**:
```javascript
{
  success: Boolean,
  member: FamilyMember
}
```

---

#### DELETE /api/family/members/:id
**Purpose**: Delete family member

**Response**:
```javascript
{
  success: Boolean
}
```

---

### Relationship Endpoints

#### GET /api/family/relationships
**Purpose**: Get all relationships

**Response**:
```javascript
{
  success: Boolean,
  relationships: Array<Relationship>
}
```

---

#### POST /api/family/relationships
**Purpose**: Create relationship

**Request**:
```javascript
{
  fromUserId: String,
  toUserId: String,
  relationshipType: String,
  specificLabel: String
}
```

**Response**:
```javascript
{
  success: Boolean,
  relationship: Relationship
}
```

---

#### DELETE /api/family/relationships/:id
**Purpose**: Delete relationship

**Response**:
```javascript
{
  success: Boolean
}
```

---

### Event Endpoints

#### GET /api/events
**Purpose**: Get all events

**Query Parameters**:
- `status` (optional) - Filter by status
- `category` (optional) - Filter by category

**Response**:
```javascript
{
  success: Boolean,
  events: Array<Event>
}
```

---

#### POST /api/events
**Purpose**: Create event

**Request**:
```javascript
{
  title: String,
  description: String,
  category: String,
  date: String,
  time: String,
  location: String,
  imageUrl: String,
  attendees: Array<String>,
  invitedGuests: Array<Object>
}
```

**Response**:
```javascript
{
  success: Boolean,
  event: Event
}
```

---

#### PUT /api/events/:id
**Purpose**: Update event

**Request**: Same as POST

**Response**:
```javascript
{
  success: Boolean,
  event: Event
}
```

---

#### DELETE /api/events/:id
**Purpose**: Delete event

**Response**:
```javascript
{
  success: Boolean
}
```

---

## Services

### FamilyService
**File**: `src/services/FamilyService.js`

**Methods**:

#### getFamilyMembers()
```javascript
// Returns all family members
const members = await FamilyService.getFamilyMembers();
```

#### addFamilyMember(memberData)
```javascript
// Add new family member
const newMember = await FamilyService.addFamilyMember({
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  status: "living",
  relatedTo: "user-123",
  relationshipType: "parent"
});
```

#### updateFamilyMember(memberId, memberData)
```javascript
// Update existing member
const updated = await FamilyService.updateFamilyMember("member-456", {
  firstName: "Jane",
  status: "living"
});
```

#### deleteFamilyMember(memberId)
```javascript
// Delete member
await FamilyService.deleteFamilyMember("member-456");
```

#### getRelationships()
```javascript
// Get all relationships
const relationships = await FamilyService.getRelationships();
```

---

### AuthService
**File**: `src/services/AuthService.js`

**Methods**:

#### signup(email, password, firstName, lastName)
```javascript
const user = await AuthService.signup(
  "alex@example.com",
  "password123",
  "Alex",
  "Rivera"
);
```

#### login(email, password)
```javascript
const user = await AuthService.login(
  "alex@example.com",
  "password123"
);
```

#### logout()
```javascript
await AuthService.logout();
```

#### getCurrentUser()
```javascript
const user = AuthService.getCurrentUser();
```

---

### UserService
**File**: `src/services/UserService.js`

**Methods**:

#### getUserProfile()
```javascript
const profile = await UserService.getUserProfile();
```

#### updateUserProfile(profileData)
```javascript
const updated = await UserService.updateUserProfile({
  firstName: "Alexander",
  bio: "Family tree enthusiast"
});
```

#### uploadProfilePhoto(file)
```javascript
const photoUrl = await UserService.uploadProfilePhoto(file);
```

---

## Using Redux in Components

### Basic Redux Pattern

**Reading State**:
```javascript
import { useSelector } from 'react-redux';
import { selectFamilyMembers } from '../redux/slices/familySlice';

function MyComponent() {
  const familyMembers = useSelector(selectFamilyMembers);
  
  return (
    <div>
      {familyMembers.map(member => (
        <div key={member.id}>{member.firstName}</div>
      ))}
    </div>
  );
}
```

**Dispatching Actions**:
```javascript
import { useDispatch } from 'react-redux';
import { addFamilyMember } from '../redux/slices/familySlice';

function MyComponent() {
  const dispatch = useDispatch();
  
  const handleAdd = async (memberData) => {
    try {
      await dispatch(addFamilyMember(memberData)).unwrap();
      // Success
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
}
```

**Complete Example**:
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectFamilyMembers,
  selectFamilyLoading,
  selectFamilyError,
  addFamilyMember,
  getFamilyMembers
} from '../redux/slices/familySlice';

function FamilyComponent() {
  const dispatch = useDispatch();
  const familyMembers = useSelector(selectFamilyMembers);
  const isLoading = useSelector(selectFamilyLoading);
  const error = useSelector(selectFamilyError);
  
  useEffect(() => {
    dispatch(getFamilyMembers());
  }, [dispatch]);
  
  const handleAdd = async (memberData) => {
    try {
      await dispatch(addFamilyMember(memberData)).unwrap();
      await dispatch(getFamilyMembers(true)).unwrap();
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {familyMembers.map(member => (
        <div key={member.id}>{member.firstName}</div>
      ))}
    </div>
  );
}
```

---

## Mock Data

### Enabling Mock Mode

Set in `.env`:
```env
VITE_MOCK_API=true
```

### Mock Data Structure

When `VITE_MOCK_API=true`, Redux thunks return mock data:

```javascript
// Mock family members
const mockMembers = [
  {
    id: "user-123",
    userId: "user-123",
    firstName: "Alex",
    lastName: "Rivera",
    photoUrl: "https://example.com/alex.jpg",
    dateOfBirth: "1995-01-15",
    gender: "male",
    status: "living",
    specificLabel: null,
    createdBy: "user-123",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-19T10:30:00Z"
  }
];

// Mock relationships
const mockRelationships = [];
```

### Adding Mock Data

Edit Redux slice files (e.g., `src/redux/slices/familySlice.js`):

```javascript
const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export const getFamilyMembers = createAsyncThunk(
  'family/getFamilyMembers',
  async (forceRefresh, { rejectWithValue }) => {
    try {
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Return mock data
        const mockMembers = [
          // Add your mock members here
        ];
        
        return mockMembers;
      }
      
      return await FamilyService.getFamilyMembers();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## Error Handling

### Error Response Format

```javascript
{
  success: false,
  error: {
    code: String,        // Error code
    message: String,     // Human-readable message
    details: Object      // Additional details
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - User not authenticated
- `FORBIDDEN` - User not authorized
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `SERVER_ERROR` - Server error

### Error Handling in Components

```javascript
try {
  const member = await addFamilyMember(formData);
  // Success
} catch (error) {
  console.error('Error:', error.message);
  // Show error to user
  setError(error.message);
}
```

### Error Boundary

```javascript
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## Request/Response Examples

### Add Family Member Request

```javascript
// Request
POST /api/family/members
{
  "firstName": "Maria",
  "lastName": "Rivera",
  "dateOfBirth": "1970-05-20",
  "gender": "female",
  "status": "living",
  "specificLabel": "Mother",
  "photoUrl": "https://example.com/maria.jpg",
  "relatedTo": "user-123",
  "relationshipType": "parent"
}

// Response
{
  "success": true,
  "member": {
    "id": "member-456",
    "userId": null,
    "firstName": "Maria",
    "lastName": "Rivera",
    "photoUrl": "https://example.com/maria.jpg",
    "dateOfBirth": "1970-05-20",
    "gender": "female",
    "status": "living",
    "specificLabel": "Mother",
    "createdBy": "user-123",
    "createdAt": "2024-12-19T10:30:00Z",
    "updatedAt": "2024-12-19T10:30:00Z"
  }
}
```

### Create Event Request

```javascript
// Request
POST /api/events
{
  "title": "Family Reunion 2024",
  "description": "Annual family gathering",
  "category": "Reunion",
  "date": "2024-07-15",
  "time": "14:00",
  "location": "Central Park, New York",
  "imageUrl": "https://example.com/reunion.jpg",
  "attendees": ["user-123", "member-456"],
  "invitedGuests": []
}

// Response
{
  "success": true,
  "event": {
    "id": "event-101",
    "title": "Family Reunion 2024",
    "description": "Annual family gathering",
    "category": "Reunion",
    "date": "2024-07-15",
    "time": "14:00",
    "location": "Central Park, New York",
    "imageUrl": "https://example.com/reunion.jpg",
    "createdBy": "user-123",
    "attendees": ["user-123", "member-456"],
    "invitedGuests": [],
    "status": "upcoming",
    "createdAt": "2024-12-19T10:30:00Z",
    "updatedAt": "2024-12-19T10:30:00Z"
  }
}
```

---

**Last Updated**: December 2024
