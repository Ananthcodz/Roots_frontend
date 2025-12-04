# Implementation Plan

- [x] 1. Set up tree visualization infrastructure
  - Create TreeContext for managing visualization state (zoom, pan, selected member)
  - Create tree layout algorithm to calculate node positions
  - Add /family-tree route to App.jsx
  - _Requirements: 1.1, 1.4_

- [x] 1.1 Write property test for tree layout algorithm
  - **Property 35: Member count accuracy**
  - **Validates: Requirements 17.2**

- [x] 1.2 Write property test for generation count calculation
  - **Property 36: Generation count accuracy**
  - **Validates: Requirements 17.3**

- [x] 2. Implement core tree components
  - [x] 2.1 Create MemberCard component
    - Display member photo, name, and relationship label
    - Handle click events for member selection
    - Apply styling for root, selected, and highlighted states
    - _Requirements: 1.2, 1.3_

- [x] 2.2 Write property test for member card display
  - **Property 1: Member card displays complete information**
  - **Validates: Requirements 1.2, 6.2, 15.2**

  - [x] 2.3 Create PlaceholderCard component
    - Display dashed border with plus icon
    - Show appropriate label (Add Father, Add Mother, Add Child)
    - Handle click events for navigation
    - _Requirements: 5.1, 5.2_

- [x] 2.4 Write property test for placeholder display
  - **Property 10: Empty positions show placeholders**
  - **Validates: Requirements 5.1**

  - [x] 2.5 Create TreeNode component (recursive)
    - Render member or placeholder card
    - Recursively render parents, spouse, children
    - Calculate relative positions for each node
    - _Requirements: 1.1, 2.4, 3.2, 4.3_

- [x] 2.6 Write property test for parent positioning
  - **Property 2: Parent positioning is correct**
  - **Validates: Requirements 2.4**

- [x] 2.7 Write property test for spouse positioning
  - **Property 3: Spouse positioning is correct**
  - **Validates: Requirements 3.2**

- [x] 2.8 Write property test for child positioning
  - **Property 7: Child positioning is correct**
  - **Validates: Requirements 4.3**

- [x] 3. Implement connection lines
  - [x] 3.1 Create ConnectionLines component using SVG
    - Draw vertical lines for parent-child relationships
    - Draw horizontal lines for spouse relationships
    - Draw branching lines for multiple children
    - Scale lines based on zoom level
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 3.2 Write property test for parent-child connections
  - **Property 20: Parent-child connection lines**
  - **Validates: Requirements 10.1, 10.3**

- [x] 3.3 Write property test for spouse connections
  - **Property 21: Spouse connection line**
  - **Validates: Requirements 10.4**

- [x] 3.4 Write property test for multiple children connections
  - **Property 22: Multiple children connection lines**
  - **Validates: Requirements 10.5**

- [x] 4. Implement TreeCanvas component
  - [x] 4.1 Create scrollable canvas container
    - Render TreeNode at root position
    - Render ConnectionLines overlay
    - Apply zoom transformation
    - Apply pan offset
    - _Requirements: 1.1, 1.4_

  - [x] 4.2 Implement pan functionality
    - Handle mouse drag events
    - Handle touch drag events
    - Update pan offset in TreeContext
    - _Requirements: 18.1_

- [x] 4.3 Write property test for pan updates
  - **Property 39: Pan updates view position**
  - **Validates: Requirements 18.1**

  - [x] 4.3 Implement zoom functionality
    - Handle scroll wheel events
    - Handle pinch gesture events
    - Maintain zoom center point at cursor/touch position
    - Clamp zoom level between 10% and 200%
    - _Requirements: 18.2, 18.3, 18.4_

- [x] 4.4 Write property test for scroll wheel zoom
  - **Property 41: Scroll wheel zoom changes zoom level**
  - **Validates: Requirements 18.3**

- [x] 4.5 Write property test for pinch zoom
  - **Property 40: Pinch zoom changes zoom level**
  - **Validates: Requirements 18.2**

- [x] 4.6 Write property test for zoom center point
  - **Property 42: Zoom maintains center point**
  - **Validates: Requirements 18.4**

- [x] 5. Implement zoom controls
  - [x] 5.1 Create ZoomControls component
    - Display minus, percentage, plus, and fullscreen buttons
    - Handle zoom in/out button clicks
    - Handle fullscreen toggle
    - Update zoom level in TreeContext
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 5.2 Write property test for zoom decrease
  - **Property 14: Zoom decrease by 10%**
  - **Validates: Requirements 7.2**

- [x] 5.3 Write property test for zoom increase
  - **Property 15: Zoom increase by 10%**
  - **Validates: Requirements 7.3**

- [x] 5.4 Write property test for zoom display update
  - **Property 16: Zoom display updates**
  - **Validates: Requirements 7.4**

- [x] 6. Implement search functionality
  - [x] 6.1 Create search input in toolbar
    - Display search input with placeholder "Search tree..."
    - Debounce search input (300ms)
    - Filter members by first name or last name (case-insensitive)
    - Update search results in TreeContext
    - _Requirements: 8.1, 8.2_

- [x] 6.2 Write property test for search filtering
  - **Property 17: Search filters members by name**
  - **Validates: Requirements 8.2**

  - [x] 6.3 Implement search highlighting
    - Highlight matching member cards
    - Dim non-matching cards when no results
    - Clear highlighting when search is cleared
    - _Requirements: 8.3, 8.4, 8.5_

- [x] 6.4 Write property test for search highlighting
  - **Property 18: Search highlights matching cards**
  - **Validates: Requirements 8.3**

- [x] 6.5 Write property test for clearing search
  - **Property 19: Clearing search removes highlighting**
  - **Validates: Requirements 8.5**

- [ ] 7. Implement tree owner sidebar
  - [ ] 7.1 Create TreeOwnerProfile component
    - Display tree owner's profile photo (circular frame)
    - Display full name and "Tree Owner" label
    - Display birth year in format "Born YYYY"
    - Display "GROW YOUR TREE" heading
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 7.2 Write property test for birth year formatting
  - **Property 13: Birth year formatting**
  - **Validates: Requirements 6.3**

  - [ ] 7.3 Create action buttons
    - Add Parents button (navigates to add member form)
    - Add Spouse button (navigates to add member form)
    - Add Children button (navigates to add member form)
    - Update button states based on existing relationships
    - _Requirements: 2.1, 3.1, 4.1_

- [ ] 7.4 Write property test for spouse button state
  - **Property 6: Spouse button state updates**
  - **Validates: Requirements 3.5**

- [ ] 8. Implement member detail panel
  - [ ] 8.1 Create MemberDetailPanel component
    - Display when a member is selected
    - Show member's large profile photo
    - Show full name, birth year, and location
    - Display "Profile" and "Edit" buttons
    - Display "Add Relative" button
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [ ] 8.2 Write property test for member click
  - **Property 30: Member click shows detail panel**
  - **Validates: Requirements 15.1**

- [ ] 8.3 Write property test for detail panel display
  - **Property 31: Detail panel displays member information**
  - **Validates: Requirements 15.2**

  - [ ] 8.4 Create related members list
    - Display each related member with photo, name, relationship label
    - Display initials badge for each member
    - Handle click to select related member
    - _Requirements: 15.5_

- [ ] 8.5 Write property test for related members display
  - **Property 32: Related members display complete information**
  - **Validates: Requirements 15.5**

- [ ] 9. Implement relationship explorer
  - [ ] 9.1 Create RelationshipExplorer component
    - Display "Start" field pre-filled with tree owner
    - Display "Target" field with member dropdown
    - Enable "Trace Path" button when target is selected
    - _Requirements: 16.1, 16.2, 16.3_

- [ ] 9.2 Write property test for trace path button
  - **Property 33: Trace path button enabled when target selected**
  - **Validates: Requirements 16.3**

  - [ ] 9.3 Implement path calculation algorithm
    - Use breadth-first search to find shortest path
    - Build relationship description from path
    - Display path or "not connected" message
    - _Requirements: 16.4, 16.5_

- [ ] 9.4 Write property test for path calculation
  - **Property 34: Path calculation between connected members**
  - **Validates: Requirements 16.4**

- [ ] 10. Implement tree statistics
  - [ ] 10.1 Create TreeStatistics component
    - Calculate total member count
    - Calculate generation count
    - Display with appropriate labels
    - Update when tree changes
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 10.2 Write property test for statistics update
  - **Property 37: Statistics update on tree changes**
  - **Validates: Requirements 17.4**

- [ ] 10.3 Write property test for member count formatting
  - **Property 38: Member count formatting**
  - **Validates: Requirements 17.5**

- [ ] 11. Implement first-time user experience
  - [ ] 11.1 Create "Start here!" tooltip
    - Display on first visit (check localStorage)
    - Position above tree owner's card
    - Dismiss on click anywhere
    - Dismiss when first member is added
    - Don't show on subsequent visits
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 12. Integrate with add member form
  - [ ] 12.1 Update AddFamilyMemberPage navigation
    - Accept relationship type and related member from URL params
    - Pre-fill "Related to" dropdown with tree owner
    - Pre-select relationship type if provided
    - Navigate back to family tree after successful add
    - _Requirements: 11.3, 11.4, 11.5_

- [ ] 12.2 Write property test for related to pre-fill
  - **Property 23: Related to dropdown pre-fill**
  - **Validates: Requirements 11.3**

- [ ] 12.3 Write property test for specific label field
  - **Property 24: Specific label field conditional enabling**
  - **Validates: Requirements 11.5**

  - [ ] 12.3 Update placeholder click handlers
    - Navigate to add member form with relationship type
    - Pass related member ID in URL params
    - _Requirements: 5.4_

- [ ] 12.4 Write property test for placeholder navigation
  - **Property 11: Placeholder click navigates correctly**
  - **Validates: Requirements 5.4**

  - [ ] 12.4 Update tree after member added
    - Refresh family members and relationships
    - Replace placeholder with new member card
    - Update tree statistics
    - _Requirements: 5.5, 4.5_

- [ ] 12.5 Write property test for placeholder replacement
  - **Property 12: Placeholder replacement after adding member**
  - **Validates: Requirements 5.5**

- [ ] 12.6 Write property test for relationship persistence
  - **Property 9: Child relationship persists**
  - **Validates: Requirements 4.5**

- [ ] 13. Implement form validation enhancements
  - [ ] 13.1 Add living status toggle validation
    - Ensure toggle state maps to boolean value
    - _Requirements: 13.2_

- [ ] 13.2 Write property test for living status toggle
  - **Property 25: Living status toggle updates state**
  - **Validates: Requirements 13.2**

  - [ ] 13.2 Enhance form validation
    - Validate all required fields on submit
    - Validate email format
    - Validate date format (DD/MM/YYYY)
    - Enable submit button only when form is valid
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [ ] 13.3 Write property test for missing field validation
  - **Property 26: Form validation identifies missing fields**
  - **Validates: Requirements 14.1**

- [ ] 13.4 Write property test for email validation
  - **Property 27: Email validation**
  - **Validates: Requirements 14.2**

- [ ] 13.5 Write property test for date validation
  - **Property 28: Date validation**
  - **Validates: Requirements 14.3**

- [ ] 13.6 Write property test for submit button state
  - **Property 29: Submit button enabled when valid**
  - **Validates: Requirements 14.4**

- [ ] 14. Create FamilyTreePage main component
  - [ ] 14.1 Assemble all components
    - NavigationBar at top
    - TreeToolbar with search and zoom controls
    - TreeSidebar with owner profile or member details
    - TreeCanvas with tree visualization
    - Handle component state and interactions
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 14.2 Implement data loading
    - Fetch family members on mount
    - Fetch relationships on mount
    - Display loading indicator
    - Handle errors with retry option
    - _Requirements: 7.1_

  - [ ] 14.3 Implement member selection
    - Update selected member in TreeContext
    - Switch sidebar to member detail panel
    - Highlight selected member card
    - _Requirements: 15.1_

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Styling and polish
  - [ ] 16.1 Apply consistent styling
    - Match existing design system colors and fonts
    - Ensure responsive layout for mobile
    - Apply hover states to interactive elements
    - Ensure focus indicators are visible
    - _Requirements: 5.3, 6.4_

  - [ ] 16.2 Optimize performance
    - Implement virtual rendering for large trees
    - Memoize tree layout calculations
    - Debounce pan/zoom updates
    - Lazy load member photos
    - _Requirements: 7.1_

  - [ ] 16.3 Add animations
    - Smooth zoom transitions
    - Smooth pan transitions
    - Fade in/out for detail panel
    - Highlight animation for search results
    - _Requirements: 8.3_

- [ ] 16.4 Write integration tests
  - Test complete user flow: view tree → search → select member → add relative
  - Test zoom and pan interactions
  - Test relationship explorer
  - Test statistics updates

- [ ] 17. Accessibility improvements
  - [ ] 17.1 Add keyboard navigation
    - Tab order: toolbar → sidebar → tree
    - Arrow keys navigate between tree nodes
    - Enter/Space activates buttons and cards
    - Escape closes detail panel
    - _Requirements: All_

  - [ ] 17.2 Add ARIA labels
    - Label all interactive elements
    - Announce zoom level changes
    - Announce search results count
    - Announce loading states
    - Announce error messages
    - _Requirements: All_

  - [ ] 17.3 Ensure visual accessibility
    - Verify color contrast (WCAG AA)
    - Ensure focus indicators are visible
    - Ensure touch targets are 44x44px minimum
    - Test with screen reader
    - _Requirements: All_

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
