# Requirements Document

## Introduction

The Family Tree feature enables users to build and visualize their family relationships starting from themselves as the root. Users can add parents, spouses, and children through a simple interface with placeholder cards and action buttons in a left sidebar. The tree displays vertically with the current user at the center, parents above, and children below.

## Glossary

- **Family Tree System**: The software system that manages and displays family relationship data
- **Tree Owner**: The authenticated user who owns and is building their family tree
- **Member Card**: A visual card displaying a family member's photo, name, and relationship label
- **Placeholder Card**: A dashed-border card with a plus icon indicating where a family member can be added
- **Sidebar Panel**: The left panel containing the tree owner's profile and action buttons or member details
- **Tree Canvas**: The main scrollable area displaying the family tree structure
- **Relationship Label**: Text indicating the relationship type (e.g., "Me / Root", "Father", "Mother")
- **Zoom Controls**: UI controls for adjusting the tree view scale (-, 100%, +, fullscreen)
- **Add Member Form**: A form page for entering new family member information
- **Member Detail Panel**: A sidebar showing detailed information about a selected family member
- **Relationship Explorer**: A tool for finding paths between two family members
- **Tree Statistics**: Metrics showing total members and generations in the tree

## Requirements

### Requirement 1

**User Story:** As a tree owner, I want to see myself as the root of the family tree, so that I can build my family history from my perspective.

#### Acceptance Criteria

1. WHEN the tree owner navigates to the family tree page THEN the Family Tree System SHALL display the tree owner's card in the center of the canvas
2. WHEN displaying the tree owner's card THEN the Family Tree System SHALL show their profile photo, full name, and the label "Me / Root"
3. WHEN the tree owner's card is displayed THEN the Family Tree System SHALL apply a distinct border style to indicate it is the root node
4. WHEN the page loads for the first time THEN the Family Tree System SHALL center the viewport on the tree owner's card
5. WHEN the tree owner has no family members added THEN the Family Tree System SHALL display placeholder cards for adding father, mother, and child

### Requirement 2

**User Story:** As a tree owner, I want to add my parents to the tree, so that I can document my immediate ancestry.

#### Acceptance Criteria

1. WHEN the tree owner clicks the "Add Parents" button in the sidebar THEN the Family Tree System SHALL navigate to a form for adding parent information
2. WHEN the tree owner clicks the "Add Father" placeholder card THEN the Family Tree System SHALL navigate to a form pre-configured for adding a father
3. WHEN the tree owner clicks the "Add Mother" placeholder card THEN the Family Tree System SHALL navigate to a form pre-configured for adding a mother
4. WHEN a parent is successfully added THEN the Family Tree System SHALL display the parent's card above the tree owner's card with appropriate relationship label
5. WHEN both parents are added THEN the Family Tree System SHALL position them side by side above the tree owner with connecting lines

### Requirement 3

**User Story:** As a tree owner, I want to add my spouse to the tree, so that I can represent my marriage relationship.

#### Acceptance Criteria

1. WHEN the tree owner clicks the "Add Spouse" button in the sidebar THEN the Family Tree System SHALL navigate to a form for adding spouse information
2. WHEN a spouse is successfully added THEN the Family Tree System SHALL display the spouse's card adjacent to the tree owner's card at the same level
3. WHEN displaying a spouse card THEN the Family Tree System SHALL show the relationship label as "Partner / Wife / Husband"
4. WHEN a spouse is added THEN the Family Tree System SHALL draw a horizontal connecting line between the tree owner and spouse cards
5. WHEN the tree owner has a spouse THEN the Family Tree System SHALL update the "Add Spouse" button to reflect the existing relationship

### Requirement 4

**User Story:** As a tree owner, I want to add my children to the tree, so that I can document my descendants.

#### Acceptance Criteria

1. WHEN the tree owner clicks the "Add Children" button in the sidebar THEN the Family Tree System SHALL navigate to a form for adding child information
2. WHEN the tree owner clicks the "Add Child" placeholder card THEN the Family Tree System SHALL navigate to a form pre-configured for adding a child
3. WHEN a child is successfully added THEN the Family Tree System SHALL display the child's card below the tree owner's card with the relationship label "Son / Daughter"
4. WHEN multiple children are added THEN the Family Tree System SHALL arrange them horizontally below the parent with connecting lines
5. WHEN a child is added THEN the Family Tree System SHALL persist the relationship to the backend immediately

### Requirement 5

**User Story:** As a tree owner, I want to see placeholder cards for missing family members, so that I know where I can expand the tree.

#### Acceptance Criteria

1. WHEN a parent position is empty THEN the Family Tree System SHALL display a dashed placeholder card with a plus icon and "Add Father" or "Add Mother" label
2. WHEN the tree owner has no children THEN the Family Tree System SHALL display a dashed placeholder card with a plus icon and "Add Child" label
3. WHEN a placeholder card is hovered THEN the Family Tree System SHALL highlight the card to indicate it is clickable
4. WHEN a placeholder card is clicked THEN the Family Tree System SHALL navigate to the appropriate add member form
5. WHEN a family member is added to a placeholder position THEN the Family Tree System SHALL replace the placeholder with the member's card

### Requirement 6

**User Story:** As a tree owner, I want to see my profile and tree ownership information in the sidebar, so that I understand whose tree I am viewing.

#### Acceptance Criteria

1. WHEN the family tree page loads THEN the Family Tree System SHALL display the tree owner's profile photo in the sidebar
2. WHEN displaying the sidebar profile THEN the Family Tree System SHALL show the tree owner's full name and the label "Tree Owner"
3. WHEN displaying the sidebar profile THEN the Family Tree System SHALL show the tree owner's birth year in the format "Born YYYY"
4. WHEN the tree owner's profile is displayed THEN the Family Tree System SHALL apply a circular frame to the profile photo
5. WHEN the sidebar loads THEN the Family Tree System SHALL display the heading "GROW YOUR TREE" above the action buttons

### Requirement 7

**User Story:** As a tree owner, I want to use zoom controls to adjust the tree view, so that I can see more or less detail as needed.

#### Acceptance Criteria

1. WHEN the family tree page loads THEN the Family Tree System SHALL display zoom controls in the top-right corner showing minus, percentage, plus, and fullscreen buttons
2. WHEN the tree owner clicks the minus button THEN the Family Tree System SHALL decrease the zoom level by 10 percent
3. WHEN the tree owner clicks the plus button THEN the Family Tree System SHALL increase the zoom level by 10 percent
4. WHEN the zoom level changes THEN the Family Tree System SHALL update the percentage display to reflect the current zoom level
5. WHEN the tree owner clicks the fullscreen button THEN the Family Tree System SHALL expand the tree canvas to fill the entire viewport

### Requirement 8

**User Story:** As a tree owner, I want to search for family members in the tree, so that I can quickly locate specific individuals.

#### Acceptance Criteria

1. WHEN the family tree page loads THEN the Family Tree System SHALL display a search input field in the top-left area with placeholder text "Search tree..."
2. WHEN the tree owner types in the search field THEN the Family Tree System SHALL filter family members whose names contain the search text
3. WHEN search results are found THEN the Family Tree System SHALL highlight matching member cards in the tree
4. WHEN no search results are found THEN the Family Tree System SHALL dim all member cards to indicate no matches
5. WHEN the search field is cleared THEN the Family Tree System SHALL remove all highlighting and restore normal card display

### Requirement 9

**User Story:** As a tree owner, I want to see a "Start here!" tooltip on my first visit, so that I understand how to begin building my tree.

#### Acceptance Criteria

1. WHEN the tree owner visits the family tree page for the first time THEN the Family Tree System SHALL display a tooltip with the text "Start here!" pointing to the tree owner's card
2. WHEN the tooltip is displayed THEN the Family Tree System SHALL position it above the tree owner's card with a downward-pointing arrow
3. WHEN the tree owner clicks anywhere on the page THEN the Family Tree System SHALL dismiss the tooltip
4. WHEN the tree owner adds their first family member THEN the Family Tree System SHALL dismiss the tooltip and not show it again
5. WHEN the tree owner has previously added family members THEN the Family Tree System SHALL not display the tooltip on subsequent visits

### Requirement 10

**User Story:** As a tree owner, I want to see connecting lines between family members, so that I can understand the relationships visually.

#### Acceptance Criteria

1. WHEN a parent is added THEN the Family Tree System SHALL draw a vertical line connecting the parent card to the tree owner's card
2. WHEN both parents are added THEN the Family Tree System SHALL draw a horizontal line connecting the two parent cards
3. WHEN a child is added THEN the Family Tree System SHALL draw a vertical line connecting the tree owner's card to the child's card
4. WHEN a spouse is added THEN the Family Tree System SHALL draw a horizontal line connecting the tree owner's card to the spouse's card
5. WHEN multiple children are added THEN the Family Tree System SHALL draw lines from a common point below the parent to each child card

### Requirement 11

**User Story:** As a tree owner, I want to fill out a comprehensive form when adding a family member, so that I can capture all relevant information about them.

#### Acceptance Criteria

1. WHEN the add member form loads THEN the Family Tree System SHALL display a "Back to Dashboard" link at the top
2. WHEN the form is displayed THEN the Family Tree System SHALL show the heading "Add Family Member" with descriptive text
3. WHEN the relationship section loads THEN the Family Tree System SHALL display a "Related to" dropdown pre-filled with the tree owner's name and photo
4. WHEN the relationship section loads THEN the Family Tree System SHALL display a "Relationship Type" dropdown with options for parent, spouse, child, and sibling
5. WHEN the relationship type is selected THEN the Family Tree System SHALL enable an optional "Specific Label" text field for custom relationship names

### Requirement 12

**User Story:** As a tree owner, I want to enter personal information for a family member, so that I can document their identity and details.

#### Acceptance Criteria

1. WHEN the personal information section loads THEN the Family Tree System SHALL display a profile photo upload area with format and size recommendations
2. WHEN the photo upload area is displayed THEN the Family Tree System SHALL show "Recommended: Square JPG or PNG, at least 400×400" guidance text
3. WHEN the personal information section loads THEN the Family Tree System SHALL display first name and last name text input fields side by side
4. WHEN the personal information section loads THEN the Family Tree System SHALL display a date of birth input field with format placeholder "DD / MM / YYYY"
5. WHEN the personal information section loads THEN the Family Tree System SHALL display gender selection buttons for "Male" and "Female"

### Requirement 13

**User Story:** As a tree owner, I want to enter contact and status information for a family member, so that I can track their living status and contact details.

#### Acceptance Criteria

1. WHEN the contact section loads THEN the Family Tree System SHALL display a "Living Status" toggle switch with the label "Is this person currently living?"
2. WHEN the living status toggle is enabled THEN the Family Tree System SHALL set the member's status to living
3. WHEN the contact section loads THEN the Family Tree System SHALL display an optional email address input field with placeholder text
4. WHEN the email field is displayed THEN the Family Tree System SHALL show a checkbox option to "Send an invite to join the family network"
5. WHEN the form is complete THEN the Family Tree System SHALL display "Cancel" and "Add Member" buttons at the bottom

### Requirement 14

**User Story:** As a tree owner, I want to validate the add member form before submission, so that I ensure all required information is provided correctly.

#### Acceptance Criteria

1. WHEN the tree owner clicks "Add Member" with empty required fields THEN the Family Tree System SHALL display validation error messages for each missing field
2. WHEN the tree owner enters an invalid email format THEN the Family Tree System SHALL display an error message indicating the email is invalid
3. WHEN the tree owner enters an invalid date format THEN the Family Tree System SHALL display an error message indicating the date format is incorrect
4. WHEN all required fields are valid THEN the Family Tree System SHALL enable the "Add Member" button
5. WHEN the tree owner clicks "Cancel" THEN the Family Tree System SHALL discard all form data and navigate back to the family tree page

### Requirement 15

**User Story:** As a tree owner, I want to view detailed information about a family member in a side panel, so that I can see their profile and relationships without leaving the tree view.

#### Acceptance Criteria

1. WHEN the tree owner clicks on a member card THEN the Family Tree System SHALL display a member detail panel on the left side
2. WHEN the detail panel opens THEN the Family Tree System SHALL show the member's large profile photo, full name, birth year, and location
3. WHEN the detail panel is displayed THEN the Family Tree System SHALL show "Profile" and "Edit" buttons below the member's photo
4. WHEN the detail panel is displayed THEN the Family Tree System SHALL show an "Add Relative" button with an icon
5. WHEN the detail panel shows related members THEN the Family Tree System SHALL display each relative with their photo, name, relationship label, and initials badge

### Requirement 16

**User Story:** As a tree owner, I want to use the relationship explorer tool, so that I can find connection paths between any two family members.

#### Acceptance Criteria

1. WHEN the relationship explorer section loads THEN the Family Tree System SHALL display a "Start" field with the tree owner's name pre-filled
2. WHEN the relationship explorer section loads THEN the Family Tree System SHALL display a "Target" field with placeholder text "Choose relative..."
3. WHEN the tree owner selects a target member THEN the Family Tree System SHALL enable a "Trace Path" button
4. WHEN the tree owner clicks "Trace Path" THEN the Family Tree System SHALL calculate and display the relationship path between the two members
5. WHEN no path exists between members THEN the Family Tree System SHALL display a message indicating the members are not connected

### Requirement 17

**User Story:** As a tree owner, I want to see tree statistics, so that I can understand the size and scope of my family tree.

#### Acceptance Criteria

1. WHEN the detail panel loads THEN the Family Tree System SHALL display a "Tree Statistics" section
2. WHEN displaying statistics THEN the Family Tree System SHALL show the total number of members in the tree
3. WHEN displaying statistics THEN the Family Tree System SHALL show the total number of generations in the tree
4. WHEN the tree is updated with new members THEN the Family Tree System SHALL recalculate and update the statistics immediately
5. WHEN displaying the member count THEN the Family Tree System SHALL format the number with appropriate labels

### Requirement 18

**User Story:** As a tree owner, I want to pan and zoom the tree canvas, so that I can navigate large family trees easily.

#### Acceptance Criteria

1. WHEN the tree owner drags on the canvas THEN the Family Tree System SHALL pan the view in the direction of the drag
2. WHEN the tree owner uses pinch gestures on touch devices THEN the Family Tree System SHALL zoom in or out based on the pinch direction
3. WHEN the tree owner uses scroll wheel on desktop THEN the Family Tree System SHALL zoom in or out based on scroll direction
4. WHEN zooming occurs THEN the Family Tree System SHALL maintain the center point of the zoom at the cursor or touch position
5. WHEN the tree owner double-clicks on the canvas THEN the Family Tree System SHALL reset the view to center on the tree owner's card
