# API & Data Structure Guide - Roots Application

## Table of Contents
1. [Data Models](#data-models)
2. [API Endpoints](#api-endpoints)
3. [Services](#services)
4. [Context API](#context-api)
5. [Mock Data](#mock-data)
6. [Error Handling](#error-handling)

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

## Context API

### FamilyContext
**File**: `src/contexts/FamilyContext.jsx`

**Usage**:
```javascript
import { useFamily } from '../contexts/FamilyContext';

function MyComponent() {
  const {
    familyMembers,
    relationships,
    isLoading,
    error,
    addFamilyMember,
    updateFamilyMember,
    getFamilyMembers,
    getRelationships
  } = useFamily();

  // Use context values and methods
}
```

**State**:
```javascript
{
  familyMembers: Array,
  relationships: Array,
  isLoading: Boolean,
  error: String
}
```

---

### TreeContext
**File**: `src/contexts/TreeContext.jsx`

**Usage**:
```javascript
import { useTree } from '../contexts/TreeContext';

function TreeComponent() {
  const {
    selectedMemberId,
    searchQuery,
    searchResults,
    zoomLevel,
    panOffset,
    handleMemberClick,
    handleSearch,
    handleZoomIn,
    handleZoomOut,
    handlePan
  } = useTree();
}
```

---

### AuthContext
**File**: `src/contexts/AuthContext.jsx`

**Usage**:
```javascript
import { useAuth } from '../contexts/AuthContext';

function AuthComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  } = useAuth();
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

When `VITE_MOCK_API=true`, the app returns mock data:

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

Edit `src/contexts/FamilyContext.jsx`:

```javascript
if (MOCK_MODE) {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data
  const mockMembers = [
    // Add your mock members here
  ];
  
  setFamilyMembers(mockMembers);
  return mockMembers;
}
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
