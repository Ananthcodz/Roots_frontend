# Family Tree Feature Design Document

## Overview

The Family Tree feature provides users with an interactive visual representation of their family relationships, starting from themselves as the root. Users can view their family tree in a hierarchical layout, add new family members through placeholder cards or sidebar actions, and explore relationships through a dedicated side panel. The tree displays vertically with parents above, the user in the center, and children below, connected by visual lines.

The design follows the existing application architecture using React with React Router for navigation, Context API for state management, and a service layer for API interactions. The feature consists of a main tree visualization page and integrates with the existing Add Family Member page.

**Design Rationale:** The family tree visualization is the core feature of the application, providing users with an intuitive way to understand and manage their family relationships. The vertical layout with the user at the center creates a natural perspective that users can easily understand. Placeholder cards guide users to expand their tree, while the sidebar provides detailed information and actions without leaving the tree view.

## Architecture

### High-Level Structure

```
Dashboard (existing)
  └─> Family Tree Page (new)
        ├─> Tree Canvas (pan/zoom)
        ├─> Sidebar Panel (profile or member details)
        └─> Add Family Member Page (existing)
```

### Component Hierarchy

```
FamilyTreePage
  ├─> NavigationBar (existing)
  ├─> TreeToolbar
  │     ├─> SearchInput
  │     └─> ZoomControls
  ├─> TreeSidebar
  │     ├─> TreeOwnerProfile
  │     │     ├─> ProfilePhoto
  │     │     ├─> ProfileInfo
  │     │     └─> ActionButtons
  │     └─> MemberDetailPanel
  │           ├─> MemberProfile
  │           ├─> ActionButtons
  │           ├─> RelatedMembersList
  │           ├─> RelationshipExplorer
  │           └─> TreeStatistics
  └─> TreeCanvas
        ├─> TreeNode (recursive)
        │     ├─> MemberCard
        │     └─> PlaceholderCard
        └─> ConnectionLines
              ├─> VerticalLine
              └─> HorizontalLine
```

### Routing Structure

The feature integrates into the existing React Router configuration:

```javascript
// New protected route to add to App.jsx
<Route path="/family-tree" element={<ProtectedRoute><FamilyTreePage /></ProtectedRoute>} />
```

**Design Rationale:** The family tree is a protected route requiring authentication, consistent with other family management features. The existing Add Family Member page is reused for adding members from the tree.

### State Management

The feature uses React Context API for state management, following the existing pattern:

- **FamilyContext** (existing): Manages family member data and relationships
- **TreeContext** (new): Manages tree visualization state (zoom, pan, selected member)
- **UserContext** (existing): Provides current user information and profile data
- **AuthContext** (existing): Handles authentication state

**Design Rationale:** A dedicated TreeContext separates visualization concerns from data management. This allows the tree rendering logic to be independent of how family data is fetched and stored.

## Components and Interfaces

### New Page Components

#### 1. FamilyTreePage

**Purpose:** Main page component that orchestrates the family tree visualization and interactions.

**Props:** None (uses context for data)

**State:**
```javascript
{
  selectedMemberId: string | null,  // Currently selected member
  searchQuery: string,              // Search input value
  searchResults: string[],          // Array of matching member IDs
  zoomLevel: number,                // Current zoom percentage (10-200)
  panOffset: { x: number, y: number }, // Canvas pan position
  isLoading: boolean,
  error: string | null,
  showFirstTimeTooltip: boolean     // "Start here!" tooltip
}
```

**Key Methods:**
- `handleMemberClick(memberId)`: Selects a member and shows detail panel
- `handlePlaceholderClick(type, relatedTo)`: Navigates to add member form
- `handleSearch(query)`: Filters members by name
- `handleZoomIn()`: Increases zoom level by 10%
- `handleZoomOut()`: Decreases zoom level by 10%
- `handleFullscreen()`: Toggles fullscreen mode
- `handlePan(deltaX, deltaY)`: Updates pan offset
- `handleReset()`: Centers view on tree owner

### New Reusable Components

#### 1. TreeCanvas

**Purpose:** Scrollable, zoomable canvas that renders the family tree structure.

**Props:**
```typescript
{
  members: FamilyMember[],
  relationships: Relationship[],
  rootMemberId: string,
  selectedMemberId: string | null,
  searchResults: string[],
  zoomLevel: number,
  panOffset: { x: number, y: number },
  onMemberClick: (memberId: string) => void,
  onPlaceholderClick: (type: string, relatedTo: string) => void,
  onPan: (deltaX: number, deltaY: number) => void
}
```

**Design Rationale:** The canvas component encapsulates all tree rendering logic, making it reusable and testable independently of the page component.

#### 2. TreeNode

**Purpose:** Recursive component that renders a family member and their relationships.

**Props:**
```typescript
{
  member: FamilyMember | null,      // Null for placeholder
  relationships: Relationship[],
  allMembers: FamilyMember[],
  isRoot: boolean,
  isSelected: boolean,
  isHighlighted: boolean,           // From search results
  onMemberClick: (memberId: string) => void,
  onPlaceholderClick: (type: string, relatedTo: string) => void
}
```

**Design Rationale:** Recursive rendering allows the tree to handle arbitrary depth and complexity. The component determines which children to render based on relationships.

#### 3. MemberCard

**Purpose:** Visual card displaying a family member's photo, name, and relationship label.

**Props:**
```typescript
{
  member: FamilyMember,
  relationshipLabel: string,        // e.g., "Father", "Mother", "Me / Root"
  isRoot: boolean,
  isSelected: boolean,
  isHighlighted: boolean,
  onClick: () => void
}
```

#### 4. PlaceholderCard

**Purpose:** Dashed card with plus icon for adding new family members.

**Props:**
```typescript
{
  type: 'father' | 'mother' | 'child' | 'spouse',
  label: string,                    // e.g., "Add Father", "Add Mother"
  onClick: () => void
}
```

#### 5. TreeSidebar

**Purpose:** Left panel showing either tree owner profile or selected member details.

**Props:**
```typescript
{
  mode: 'owner' | 'member',
  treeOwner: FamilyMember,
  selectedMember: FamilyMember | null,
  relatedMembers: FamilyMember[],
  treeStatistics: { memberCount: number, generationCount: number },
  onAddRelative: () => void,
  onEditMember: () => void,
  onProfileClick: () => void
}
```

#### 6. RelationshipExplorer

**Purpose:** Tool for finding paths between two family members.

**Props:**
```typescript
{
  startMember: FamilyMember,
  allMembers: FamilyMember[],
  relationships: Relationship[],
  onTracePath: (startId: string, targetId: string) => void
}
```

**Design Rationale:** The relationship explorer helps users understand complex family connections by calculating and displaying the path between any two members.

#### 7. ZoomControls

**Purpose:** UI controls for adjusting tree zoom level.

**Props:**
```typescript
{
  zoomLevel: number,
  onZoomIn: () => void,
  onZoomOut: () => void,
  onFullscreen: () => void
}
```

#### 8. ConnectionLines

**Purpose:** SVG component that draws lines connecting family members.

**Props:**
```typescript
{
  relationships: Relationship[],
  memberPositions: Map<string, { x: number, y: number }>,
  zoomLevel: number
}
```

**Design Rationale:** Using SVG for connection lines provides crisp rendering at any zoom level and allows for smooth animations during pan/zoom operations.

## Data Models

### FamilyMember (existing)

```typescript
interface FamilyMember {
  id: string;
  userId: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  isLiving: boolean;
  email: string | null;
  photoUrl: string | null;
  location: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

### Relationship (existing)

```typescript
interface Relationship {
  id: string;
  fromUserId: string;
  toUserId: string;
  relationshipType: 'parent' | 'child' | 'sibling' | 'spouse' | 
                    'grandparent' | 'grandchild' | 'aunt' | 'uncle' | 
                    'cousin' | 'other';
  specificLabel: string | null;
  createdAt: string;
}
```

### TreeNode (internal)

```typescript
interface TreeNode {
  member: FamilyMember;
  parents: TreeNode[];
  children: TreeNode[];
  spouse: TreeNode | null;
  siblings: TreeNode[];
  level: number;                    // Generation level (0 = root)
  position: { x: number, y: number }; // Canvas coordinates
}
```

**Design Rationale:** The TreeNode structure is built from FamilyMember and Relationship data to facilitate tree rendering. It's computed on the client side and not persisted.

### TreeStatistics

```typescript
interface TreeStatistics {
  memberCount: number;
  generationCount: number;
  oldestMember: FamilyMember | null;
  youngestMember: FamilyMember | null;
}
```

### RelationshipPath

```typescript
interface RelationshipPath {
  startMember: FamilyMember;
  endMember: FamilyMember;
  path: Array<{
    member: FamilyMember;
    relationship: string;
  }>;
  description: string;              // e.g., "Father's Mother (Paternal Grandmother)"
}
```

**Design Rationale:** The relationship path structure provides a clear representation of how two family members are connected, which can be displayed to users in a readable format.

## 
Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all testable criteria, I've identified areas where properties can be consolidated:

- **Member card display properties (1.2, 6.2, 15.2)**: All test that member information is displayed correctly and can be combined
- **Connection line properties (10.1, 10.3, 10.4)**: All test that relationships create visual connections and can be combined
- **Zoom control properties (7.2, 7.3, 7.4)**: All test zoom behavior and can be combined into comprehensive zoom properties
- **Form validation properties (14.1, 14.2, 14.3)**: All test validation and can be combined into a comprehensive validation property
- **Navigation properties (2.1, 2.2, 2.3, 3.1, 4.1, 4.2)**: These are specific navigation examples better suited for integration tests

The properties below focus on core behavioral properties that should hold across all valid inputs.

### Core Correctness Properties

**Property 1: Member card displays complete information**
*For any* family member, the displayed card should contain their profile photo (or placeholder), full name, and relationship label.
**Validates: Requirements 1.2, 6.2, 15.2**

**Property 2: Parent positioning is correct**
*For any* family member added as a parent, their card should be positioned above the child's card in the tree layout.
**Validates: Requirements 2.4**

**Property 3: Spouse positioning is correct**
*For any* family member added as a spouse, their card should be positioned adjacent to the tree owner's card at the same vertical level.
**Validates: Requirements 3.2**

**Property 4: Spouse label is correct**
*For any* family member with a spouse relationship, the card should display a relationship label containing "Partner", "Wife", or "Husband".
**Validates: Requirements 3.3**

**Property 5: Spouse connection line exists**
*For any* family member with a spouse relationship, a horizontal connecting line should be drawn between the two cards.
**Validates: Requirements 3.4**

**Property 6: Spouse button state updates**
*For any* tree owner, when a spouse exists, the "Add Spouse" button should reflect the existing relationship (disabled or showing "View Spouse").
**Validates: Requirements 3.5**

**Property 7: Child positioning is correct**
*For any* family member added as a child, their card should be positioned below the parent's card with the correct relationship label.
**Validates: Requirements 4.3**

**Property 8: Multiple children are arranged horizontally**
*For any* family member with multiple children, all child cards should be arranged horizontally at the same vertical level below the parent.
**Validates: Requirements 4.4**

**Property 9: Child relationship persists**
*For any* child added to the tree, the relationship should be immediately persisted to the backend and retrievable on page reload.
**Validates: Requirements 4.5**

**Property 10: Empty positions show placeholders**
*For any* family member without a father or mother, a placeholder card should be displayed in the empty parent position.
**Validates: Requirements 5.1**

**Property 11: Placeholder click navigates correctly**
*For any* placeholder card, clicking it should navigate to the add member form with the relationship type pre-configured.
**Validates: Requirements 5.4**

**Property 12: Placeholder replacement after adding member**
*For any* placeholder position, after successfully adding a family member, the placeholder should be replaced with the member's card.
**Validates: Requirements 5.5**

**Property 13: Birth year formatting**
*For any* family member with a date of birth, the sidebar should display the birth year in the format "Born YYYY".
**Validates: Requirements 6.3**

**Property 14: Zoom decrease by 10%**
*For any* current zoom level above 10%, clicking the minus button should decrease the zoom level by exactly 10 percentage points.
**Validates: Requirements 7.2**

**Property 15: Zoom increase by 10%**
*For any* current zoom level below 200%, clicking the plus button should increase the zoom level by exactly 10 percentage points.
**Validates: Requirements 7.3**

**Property 16: Zoom display updates**
*For any* zoom level change, the percentage display should immediately update to show the new zoom level.
**Validates: Requirements 7.4**

**Property 17: Search filters members by name**
*For any* search query and set of family members, the search results should include all and only those members whose first or last name contains the query string (case-insensitive).
**Validates: Requirements 8.2**

**Property 18: Search highlights matching cards**
*For any* search query with results, all matching member cards in the tree should be visually highlighted.
**Validates: Requirements 8.3**

**Property 19: Clearing search removes highlighting**
*For any* tree with search highlighting active, clearing the search field should remove all highlighting and restore normal card display.
**Validates: Requirements 8.5**

**Property 20: Parent-child connection lines**
*For any* parent-child relationship, a vertical connecting line should be drawn between the parent's card and the child's card.
**Validates: Requirements 10.1, 10.3**

**Property 21: Spouse connection line**
*For any* spouse relationship, a horizontal connecting line should be drawn between the two spouse cards.
**Validates: Requirements 10.4**

**Property 22: Multiple children connection lines**
*For any* family member with multiple children, connecting lines should be drawn from a common point below the parent to each child card.
**Validates: Requirements 10.5**

**Property 23: Related to dropdown pre-fill**
*For any* add member form opened from the tree, the "Related to" dropdown should be pre-filled with the tree owner's name and photo.
**Validates: Requirements 11.3**

**Property 24: Specific label field conditional enabling**
*For any* relationship type selection, the "Specific Label" text field should be enabled and editable.
**Validates: Requirements 11.5**

**Property 25: Living status toggle updates state**
*For any* living status toggle state, toggling it should flip the member's living status to the opposite boolean value.
**Validates: Requirements 13.2**

**Property 26: Form validation identifies missing fields**
*For any* form submission with one or more empty required fields, the validation should return errors for exactly those fields that are missing.
**Validates: Requirements 14.1**

**Property 27: Email validation**
*For any* email input, the validation should return an error if and only if the email does not match valid email format (contains @, has domain, has TLD).
**Validates: Requirements 14.2**

**Property 28: Date validation**
*For any* date input, the validation should return an error if and only if the date does not match the format DD/MM/YYYY or represents an invalid date.
**Validates: Requirements 14.3**

**Property 29: Submit button enabled when valid**
*For any* form state, the "Add Member" button should be enabled if and only if all required fields are filled with valid data.
**Validates: Requirements 14.4**

**Property 30: Member click shows detail panel**
*For any* member card clicked, the detail panel should open on the left side displaying that member's information.
**Validates: Requirements 15.1**

**Property 31: Detail panel displays member information**
*For any* selected member, the detail panel should display their profile photo, full name, birth year, and location (if available).
**Validates: Requirements 15.2**

**Property 32: Related members display complete information**
*For any* selected member with related family members, each related member should be displayed with their photo, name, relationship label, and initials badge.
**Validates: Requirements 15.5**

**Property 33: Trace path button enabled when target selected**
*For any* relationship explorer state, the "Trace Path" button should be enabled if and only if a target member has been selected.
**Validates: Requirements 16.3**

**Property 34: Path calculation between connected members**
*For any* two family members that are connected through relationships, clicking "Trace Path" should calculate and display a valid relationship path between them.
**Validates: Requirements 16.4**

**Property 35: Member count accuracy**
*For any* family tree, the displayed member count should equal the total number of family members in the tree.
**Validates: Requirements 17.2**

**Property 36: Generation count accuracy**
*For any* family tree, the displayed generation count should equal the number of distinct generation levels in the tree.
**Validates: Requirements 17.3**

**Property 37: Statistics update on tree changes**
*For any* family tree, when a new member is added, the statistics (member count and generation count) should immediately recalculate and update.
**Validates: Requirements 17.4**

**Property 38: Member count formatting**
*For any* member count value, it should be displayed with appropriate labels (e.g., "42 Members").
**Validates: Requirements 17.5**

**Property 39: Pan updates view position**
*For any* drag gesture on the canvas, the view should pan by the same delta as the drag movement.
**Validates: Requirements 18.1**

**Property 40: Pinch zoom changes zoom level**
*For any* pinch gesture on touch devices, the zoom level should increase for pinch-out and decrease for pinch-in.
**Validates: Requirements 18.2**

**Property 41: Scroll wheel zoom changes zoom level**
*For any* scroll wheel movement, the zoom level should increase for scroll-up and decrease for scroll-down.
**Validates: Requirements 18.3**

**Property 42: Zoom maintains center point**
*For any* zoom operation, the point under the cursor or touch should remain at the same screen position after the zoom completes.
**Validates: Requirements 18.4**

## Error Handling

### Data Loading Errors

**Error Scenarios:**
1. **Network timeout**: Display "Request timed out. Please check your connection and try again."
2. **Server error (5xx)**: Display "Something went wrong on our end. Please try again later."
3. **Unauthorized (401)**: Redirect to sign-in page
4. **Empty tree**: Display welcome message with "Start here!" tooltip

**Retry Strategy:**
- Failed data loads show a "Retry" button
- Maximum 3 automatic retries for transient failures
- Exponential backoff between retries (1s, 2s, 4s)

**Design Rationale:** Clear error messages help users understand what went wrong. Automatic retries handle transient network issues without user intervention.

### Tree Rendering Errors

**Error Scenarios:**
1. **Circular relationships**: Detect and display error "Invalid family tree structure detected. Please contact support."
2. **Missing member data**: Display placeholder card with "Data unavailable"
3. **Invalid relationship types**: Log error and skip rendering that relationship

**Design Rationale:** The tree rendering should be resilient to data inconsistencies. Invalid data should not crash the application but should be logged for debugging.

### Form Validation Errors

**Client-Side Validation:**
- All form inputs are validated before submission
- Validation errors are displayed inline next to the relevant field
- Form submission is prevented until all validation errors are resolved

**Validation Rules:**
- Required fields: relationshipType, firstName, lastName, dateOfBirth, gender
- Email format: Must match standard email regex pattern
- Date format: Must be valid date in DD/MM/YYYY format
- Photo file size: Maximum 10MB
- Photo file type: Only JPG, PNG accepted

**Design Rationale:** Client-side validation provides immediate feedback and reduces unnecessary server requests. All validation is also performed server-side for security.

### Search Errors

**Error Scenarios:**
1. **No results found**: Dim all cards and display "No members found matching '[query]'"
2. **Search service unavailable**: Display "Search temporarily unavailable. Showing all members."

**Design Rationale:** Search failures should not prevent users from viewing their tree. Graceful degradation ensures the core functionality remains available.

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples, edge cases, and component behavior:

**Component Tests:**
- Each component renders without errors
- Member cards display correct information
- Placeholder cards appear in correct positions
- Zoom controls update zoom level correctly
- Search input filters members correctly
- Detail panel displays selected member information
- Connection lines are drawn between related members

**Service Tests:**
- API calls format requests correctly
- Responses are parsed correctly
- Errors are handled appropriately

**Utility Tests:**
- Tree layout algorithm positions nodes correctly
- Relationship path calculation finds correct paths
- Statistics calculation counts members and generations correctly
- Date formatting produces correct output

**Edge Cases:**
- Empty tree (no family members)
- Single member tree (only tree owner)
- Tree with only parents
- Tree with only children
- Tree with multiple generations
- Maximum zoom level (200%)
- Minimum zoom level (10%)
- Search with no results
- Relationship path with no connection

### Property-Based Testing

Property-based tests will verify universal properties across all valid inputs using the **fast-check** library.

**Configuration:**
- Each property test runs a minimum of 100 iterations
- Tests use appropriate generators for each data type
- Edge cases are automatically explored by the PBT framework

**Test Tagging:**
- Each property-based test includes a comment with the format: `**Feature: family-tree, Property {number}: {property_text}**`
- This links the test directly to the correctness property in this design document

**Property Test Coverage:**
- Member card rendering with various member data
- Tree layout with various family structures
- Zoom operations with various zoom levels
- Pan operations with various drag deltas
- Search functionality with various queries and data sets
- Form validation with various input combinations
- Relationship path calculation with various tree structures
- Statistics calculation with various tree sizes

**Generators:**
- Family member generator: Creates random family member data
- Relationship generator: Creates valid parent/child/spouse/sibling relationships
- Tree structure generator: Creates valid family tree structures
- Search query generator: Creates random search strings
- Zoom level generator: Creates valid zoom levels (10-200)
- Pan offset generator: Creates random pan positions
- Form data generator: Creates complete form submissions with valid/invalid fields

**Design Rationale:** Property-based testing complements unit tests by exploring a much larger input space automatically. The fast-check library provides excellent generators and shrinking capabilities to find minimal failing examples.

### Integration Testing

Integration tests verify that components work together correctly:

- Complete user flows (view tree, add member, search, zoom/pan)
- Navigation between tree page and add member form
- Context providers supply correct data to components
- Service layer integrates with components correctly
- Tree updates after adding members
- Detail panel updates when selecting different members

### Accessibility Testing

- Keyboard navigation works for all interactive elements
- Screen reader labels are present and descriptive
- Focus indicators are visible
- Color contrast meets WCAG AA standards
- Zoom controls are keyboard accessible
- Search input is keyboard accessible

**Design Rationale:** Accessibility ensures the family tree is usable by all family members regardless of ability. Following WCAG guidelines provides a baseline for accessibility compliance.

## Security Considerations

### Authentication

- Family tree page requires authentication (protected route)
- API requests include authentication tokens
- Expired tokens trigger re-authentication flow

### Authorization

- Users can only view their own family tree
- Users can only add members to their own tree
- Users can only edit members they created
- Relationship data is validated server-side

### Data Privacy

- Profile photos are stored securely with access controls
- Family member data is only accessible to tree members
- Search only returns members within the user's tree
- Relationship data is not exposed to unauthorized users

**Design Rationale:** Security is implemented in layers with both client-side and server-side validation. Authentication and authorization ensure users can only access and modify their own family data.

## Performance Considerations

### Tree Rendering Optimization

- Virtual rendering for large trees (only render visible nodes)
- Canvas rendering using HTML5 Canvas or SVG for better performance
- Memoization of tree layout calculations
- Debounced pan/zoom updates (16ms for 60fps)

**Design Rationale:** Large family trees can contain hundreds of members. Virtual rendering and canvas-based rendering ensure smooth performance even with complex trees.

### Data Loading

- Family members and relationships loaded in a single request
- Data cached in context to avoid repeated API calls
- Lazy loading of member photos (load as they come into view)
- Optimistic updates for adding members (update UI before server confirms)

### Image Optimization

- Profile photos are compressed and resized server-side
- Thumbnails are generated for tree cards (100x100px)
- Images are lazy-loaded as they enter viewport
- Image caching in browser

**Design Rationale:** Image optimization significantly reduces load time and bandwidth usage, especially for trees with many members.

### Search Performance

- Search is debounced (300ms) to reduce unnecessary filtering
- Search uses client-side filtering (no API calls)
- Search results are memoized

### Layout Calculation

- Tree layout is calculated once and cached
- Layout only recalculates when tree structure changes
- Layout algorithm uses efficient positioning (O(n) complexity)

**Design Rationale:** Performance optimizations ensure the tree remains responsive even with large family structures. Caching and memoization prevent unnecessary recalculations.

## Accessibility

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows logical reading order (toolbar → sidebar → tree)
- Focus indicators are clearly visible
- Escape key closes detail panel
- Arrow keys can navigate between tree nodes
- Enter/Space activates buttons and cards

### Screen Reader Support

- All member cards have descriptive ARIA labels
- Relationship labels are announced
- Zoom level changes are announced
- Search results count is announced
- Loading states are announced
- Error messages are announced
- ARIA labels provide context for icon-only buttons

### Visual Design

- Color contrast meets WCAG AA standards (4.5:1 for text)
- Focus indicators are visible against all backgrounds
- Connection lines use sufficient contrast
- Placeholder cards are distinguishable from member cards
- Zoom controls have clear labels

### Mobile Accessibility

- Touch targets are at least 44x44px
- Pinch-to-zoom is enabled
- Pan gestures work smoothly
- Detail panel is accessible on mobile
- Search input is optimized for mobile keyboards

**Design Rationale:** Accessibility requirements ensure the family tree is usable by all family members regardless of ability. Following WCAG guidelines provides a baseline for accessibility compliance.

## Dependencies

### Existing Dependencies (from package.json)

- **react**: ^19.2.0 - Core framework
- **react-dom**: ^19.2.0 - DOM rendering
- **react-router-dom**: ^7.9.6 - Routing and navigation
- **axios**: ^1.13.2 - HTTP client for API calls
- **fast-check**: ^4.3.0 - Property-based testing library
- **@testing-library/react**: ^16.3.0 - Component testing utilities
- **vitest**: ^3.2.4 - Test runner

### Potential New Dependencies

**Option 1: D3.js for Tree Layout**
- **d3-hierarchy**: Tree layout algorithms
- **Pros**: Battle-tested, flexible, powerful
- **Cons**: Large bundle size, learning curve
- **Recommendation**: Consider if tree layout becomes complex

**Option 2: React Flow for Tree Visualization**
- **reactflow**: React-based node graph library
- **Pros**: React-native, good performance, built-in pan/zoom
- **Cons**: Designed for flowcharts, may need customization
- **Recommendation**: Evaluate if custom implementation is insufficient

**Option 3: Custom Implementation**
- **Pros**: No additional dependencies, full control, smaller bundle
- **Cons**: More development time, need to implement pan/zoom
- **Recommendation**: Start with this approach, add library if needed

**Design Rationale:** Starting with a custom implementation minimizes dependencies and bundle size. If tree layout or interaction becomes complex, we can add a specialized library.

## Migration and Rollout

### Phase 1: Core Infrastructure (Week 1)

- Create TreeContext for visualization state
- Extend FamilyContext with tree-specific methods
- Create tree layout algorithm
- Add family tree route to App.jsx
- Create basic TreeCanvas component

### Phase 2: Tree Visualization (Week 2)

- Implement TreeNode component (recursive)
- Implement MemberCard component
- Implement PlaceholderCard component
- Implement ConnectionLines component
- Implement basic tree rendering
- Write unit tests for tree components

### Phase 3: Interactions (Week 3)

- Implement pan and zoom functionality
- Implement member selection
- Implement search functionality
- Implement zoom controls
- Write property tests for interactions

### Phase 4: Sidebar and Details (Week 4)

- Implement TreeSidebar component
- Implement TreeOwnerProfile component
- Implement MemberDetailPanel component
- Implement RelationshipExplorer component
- Implement TreeStatistics component
- Write unit tests for sidebar components

### Phase 5: Integration and Polish (Week 5)

- Integration testing across all components
- Accessibility audit and fixes
- Performance optimization
- Bug fixes and refinements
- Write property tests for end-to-end flows

**Design Rationale:** Phased rollout allows for iterative development and testing. Each phase delivers a complete, testable feature that can be deployed independently if needed.

## Future Enhancements

### Potential Additions (Out of Scope for Initial Release)

1. **Tree Export**: Export tree as PDF or image
2. **Tree Sharing**: Share tree view with family members
3. **Timeline View**: View family history on a timeline
4. **Advanced Filtering**: Filter tree by generation, age, location
5. **Tree Comparison**: Compare trees between family members
6. **Collaborative Editing**: Multiple users editing tree simultaneously
7. **Tree Templates**: Pre-built tree structures for common scenarios
8. **DNA Integration**: Import DNA test results to suggest relationships
9. **Historical Records**: Link to historical records and documents
10. **Tree Animations**: Animated transitions when adding members

**Design Rationale:** These enhancements would add significant value but are not essential for the initial release. They can be prioritized based on user feedback and usage patterns.
