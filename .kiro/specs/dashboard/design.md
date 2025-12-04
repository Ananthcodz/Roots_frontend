# Dashboard Feature Design Document

## Overview

The Family Hub Dashboard is the central authenticated interface that provides users with a comprehensive overview of their family network activity. It aggregates recent updates, displays upcoming events, offers quick access to common actions, and presents key statistics about the user's family tree. The dashboard is designed to be the primary landing page after authentication, providing an at-a-glance view of family connections and activities.

## Architecture

The dashboard follows a component-based architecture with the following layers:

1. **Presentation Layer**: React components for UI rendering
2. **State Management Layer**: Context providers for dashboard data
3. **Service Layer**: API services for data fetching
4. **Data Layer**: Backend API endpoints for dashboard data

### Component Hierarchy

```
DashboardPage
├── NavigationBar
│   ├── Logo
│   ├── NavLinks
│   └── UserProfile
├── DashboardHeader
│   ├── Greeting
│   └── DateDisplay
├── MainContent
│   ├── RecentUpdates
│   │   ├── UpdateItem (birthday)
│   │   ├── UpdateItem (photos)
│   │   └── UpdateItem (new member)
│   ├── UpcomingEvents
│   │   └── EventItem[]
│   └── MemorySpotlight
│       └── MemoryCard
└── Sidebar
    ├── QuickActions
    │   └── ActionButton[]
    ├── TreeOverview
    │   └── StatCard[]
    └── OnlineNow
        └── OnlineUser[]
```

## Components and Interfaces

### DashboardPage Component

Main container component that orchestrates all dashboard sections.

**Props:**
- None (uses context for user data)

**State:**
- `isLoading: boolean` - Overall loading state
- `error: Error | null` - Error state for dashboard

**Methods:**
- `refreshDashboard()` - Manually refresh all dashboard data
- `handleSectionError(section, error)` - Handle errors from individual sections

### NavigationBar Component

Top navigation bar with links and user profile.

**Props:**
```typescript
interface NavigationBarProps {
  currentPage: 'dashboard' | 'family-tree' | 'memories' | 'messages' | 'events';
  user: {
    firstName: string;
    lastName: string;
    photoUrl?: string;
  };
  onNavigate: (page: string) => void;
}
```

### Greeting Component

Displays time-appropriate greeting with user's name.

**Props:**
```typescript
interface GreetingProps {
  firstName: string;
  currentTime?: Date; // Optional for testing
}
```

**Methods:**
- `getTimeBasedGreeting(time: Date): string` - Returns "Good Morning", "Good Afternoon", or "Good Evening"

### RecentUpdates Component

Displays feed of recent family activities.

**Props:**
```typescript
interface RecentUpdatesProps {
  updates: Update[];
  onViewAll: () => void;
  onUpdateAction: (updateId: string, action: string) => void;
}

interface Update {
  id: string;
  type: 'birthday' | 'photo' | 'new_member' | 'event';
  timestamp: Date;
  data: BirthdayUpdate | PhotoUpdate | NewMemberUpdate;
}

interface BirthdayUpdate {
  relativeName: string;
  age: number;
  date: Date;
}

interface PhotoUpdate {
  uploaderName: string;
  albumName: string;
  photoUrls: string[]; // Max 3
  timestamp: Date;
}

interface NewMemberUpdate {
  relativeName: string;
  joinedAt: Date;
}
```

### QuickActions Component

Panel with frequently used action buttons.

**Props:**
```typescript
interface QuickActionsProps {
  actions: Action[];
  onActionClick: (actionId: string) => void;
}

interface Action {
  id: string;
  label: string;
  icon: string;
  route: string;
}
```

### UpcomingEvents Component

List of upcoming family events.

**Props:**
```typescript
interface UpcomingEventsProps {
  events: Event[];
  onCalendarClick: () => void;
  onEventClick: (eventId: string) => void;
}

interface Event {
  id: string;
  name: string;
  date: Date;
  time: string;
  location?: string;
  isToday: boolean;
}
```

### MemorySpotlight Component

Featured memory or photo collection.

**Props:**
```typescript
interface MemorySpotlightProps {
  memory: Memory;
  onFavoriteToggle: (memoryId: string) => void;
  onMemoryClick: (memoryId: string) => void;
}

interface Memory {
  id: string;
  title: string;
  date: Date;
  photoUrl: string;
  uploaderName?: string;
  isFavorite: boolean;
}
```

### TreeOverview Component

Statistics about user's family tree.

**Props:**
```typescript
interface TreeOverviewProps {
  stats: TreeStats;
  onClick: () => void;
}

interface TreeStats {
  memberCount: number;
  generationCount: number;
}
```

### OnlineNow Component

Display of currently online family members.

**Props:**
```typescript
interface OnlineNowProps {
  onlineUsers: OnlineUser[];
  maxDisplay?: number; // Default 4
  onUserClick: (userId: string) => void;
}

interface OnlineUser {
  id: string;
  name: string;
  photoUrl: string;
}
```

## Data Models

### Dashboard Data Model

```typescript
interface DashboardData {
  user: User;
  recentUpdates: Update[];
  upcomingEvents: Event[];
  memorySpotlight: Memory;
  treeStats: TreeStats;
  onlineUsers: OnlineUser[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
}
```

### Update Types

```typescript
type UpdateType = 'birthday' | 'photo' | 'new_member' | 'event' | 'milestone';

interface BaseUpdate {
  id: string;
  type: UpdateType;
  timestamp: Date;
  relativeId: string;
  relativeName: string;
}

interface BirthdayUpdate extends BaseUpdate {
  type: 'birthday';
  age: number;
  birthdayDate: Date;
}

interface PhotoUpdate extends BaseUpdate {
  type: 'photo';
  albumId: string;
  albumName: string;
  photoUrls: string[];
  photoCount: number;
}

interface NewMemberUpdate extends BaseUpdate {
  type: 'new_member';
  joinedAt: Date;
  relationship?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time-based greeting correctness
*For any* time of day, the greeting should display the correct salutation: "Good Morning" for 00:00-11:59, "Good Afternoon" for 12:00-17:59, and "Good Evening" for 18:00-23:59
**Validates: Requirements 1.2, 1.3, 1.4**

### Property 2: Greeting personalization
*For any* user with a first name, the greeting should include that user's first name
**Validates: Requirements 1.1**

### Property 3: Date formatting consistency
*For any* date, the system should format it as "Month DD, YYYY" (e.g., "October 24, 2025")
**Validates: Requirements 1.5**

### Property 4: Recent updates limiting
*For any* list of updates, the dashboard should display only the 10 most recent items in reverse chronological order
**Validates: Requirements 2.1**

### Property 5: Birthday update completeness
*For any* birthday update, the rendered output should contain the relative's name, age, and birthday date
**Validates: Requirements 2.2**

### Property 6: Photo thumbnail limiting
*For any* photo update with N photos, the dashboard should display min(N, 3) thumbnail previews
**Validates: Requirements 2.3**

### Property 7: New member update completeness
*For any* new member update, the rendered output should contain the relative's name and join timestamp
**Validates: Requirements 2.4**

### Property 8: Event ordering and limiting
*For any* list of events, the dashboard should display the next 5 upcoming events in chronological order
**Validates: Requirements 4.1**

### Property 9: Event display completeness
*For any* event, the rendered output should contain the date, month abbreviation, event name, and time
**Validates: Requirements 4.2**

### Property 10: Today event highlighting
*For any* event occurring today, the system should apply a distinct visual indicator
**Validates: Requirements 4.4**

### Property 11: Memory spotlight completeness
*For any* memory, the rendered output should contain the title, date, and featured photo URL
**Validates: Requirements 5.2**

### Property 12: Memory uploader display
*For any* memory with an uploader, the rendered output should contain "Uploaded by [uploader name]"
**Validates: Requirements 5.3**

### Property 13: Favorite toggle correctness
*For any* memory, clicking the favorite icon should toggle the favorite status from true to false or false to true
**Validates: Requirements 5.4**

### Property 14: Member count accuracy
*For any* family tree, the displayed member count should equal the total number of unique members in the tree
**Validates: Requirements 6.1**

### Property 15: Generation count accuracy
*For any* family tree, the displayed generation count should equal the maximum depth of the tree
**Validates: Requirements 6.2**

### Property 16: Tree statistics completeness
*For any* family tree, the statistics should be calculated from all members in the tree, not a subset
**Validates: Requirements 6.3**

### Property 17: Online users limiting
*For any* list of online users, the dashboard should display at most 4 user profile photos
**Validates: Requirements 7.1**

### Property 18: Online count indicator
*For any* list of online users with count > 4, the dashboard should display a count indicator showing the additional online members
**Validates: Requirements 7.2**

### Property 19: Responsive layout - mobile
*For any* viewport width < 768px, the dashboard should display sections in a single-column vertical stack
**Validates: Requirements 10.1**

### Property 20: Responsive layout - tablet
*For any* viewport width between 768px and 1024px, the dashboard should display sections in a two-column layout
**Validates: Requirements 10.2**

### Property 21: Responsive layout - desktop
*For any* viewport width >= 1024px, the dashboard should display sections in a three-column layout with sidebar
**Validates: Requirements 10.3**

### Property 22: Navigation collapse
*For any* viewport width < 768px, the navigation bar should collapse into a hamburger menu
**Validates: Requirements 10.4**

### Property 23: Birthday action links
*For any* birthday update, the rendered output should contain "Send a wish" and "Send gift card" action links
**Validates: Requirements 11.1**

### Property 24: New member action links
*For any* new member update, the rendered output should contain "View Profile" and "Message" action links
**Validates: Requirements 11.4**

### Property 25: ARIA labels presence
*For any* interactive element on the dashboard, the element should have an appropriate ARIA label or aria-labelledby attribute
**Validates: Requirements 12.1**

### Property 26: Keyboard focus indicators
*For any* focusable element, the element should have a visible focus indicator when focused via keyboard navigation
**Validates: Requirements 12.2**

### Property 27: Image alt text presence
*For any* image displayed on the dashboard, the image should have descriptive alt text
**Validates: Requirements 12.4**

## Error Handling

### Error Types

1. **Network Errors**: Failed API requests
2. **Data Errors**: Invalid or missing data from API
3. **Authentication Errors**: Expired or invalid tokens
4. **Permission Errors**: User lacks access to certain data

### Error Handling Strategy

- **Section-level error boundaries**: Each dashboard section should handle its own errors independently
- **Graceful degradation**: If one section fails, others should continue to function
- **Retry mechanisms**: Automatic retry for transient network errors (max 3 attempts)
- **User feedback**: Clear error messages with actionable next steps
- **Fallback UI**: Display skeleton or empty state when data is unavailable

### Error Recovery

```typescript
interface ErrorState {
  section: string;
  error: Error;
  retryCount: number;
  canRetry: boolean;
}

function handleSectionError(section: string, error: Error): void {
  // Log error for monitoring
  logError(section, error);
  
  // Determine if retry is possible
  const canRetry = isRetryableError(error);
  
  // Update section error state
  setSectionError({ section, error, retryCount: 0, canRetry });
  
  // Show user-friendly error message
  showErrorNotification(section, error);
}
```

## Testing Strategy

### Unit Testing

Unit tests will cover:
- Individual component rendering with various props
- Utility functions (date formatting, time-based greetings, data transformations)
- Error handling logic
- State management functions

### Property-Based Testing

Property-based tests will verify:
- Time-based greeting logic across all possible times
- Update filtering and sorting across various data sets
- Responsive layout behavior across viewport ranges
- Data transformation correctness
- Accessibility attribute presence

**Property Testing Library**: fast-check (already in use)

**Configuration**: Each property test should run a minimum of 100 iterations

**Test Tagging**: Each property-based test must include a comment with the format:
`// Feature: dashboard, Property N: [property description]`

### Integration Testing

Integration tests will verify:
- Dashboard data fetching and display
- Navigation between dashboard sections
- User interactions (clicks, favorites, etc.)
- Real-time updates (online status, new updates)

### Accessibility Testing

- Keyboard navigation through all interactive elements
- Screen reader compatibility (ARIA labels, semantic HTML)
- Color contrast ratios
- Focus management

## Performance Considerations

### Loading Strategy

1. **Initial Load**: Display skeleton UI immediately
2. **Progressive Loading**: Load sections independently
3. **Priority Loading**: Load above-the-fold content first
4. **Lazy Loading**: Defer below-the-fold content

### Caching Strategy

- Cache dashboard data for 5 minutes
- Invalidate cache on user actions (add relative, upload photo, etc.)
- Use stale-while-revalidate pattern for better UX

### Optimization Techniques

- **Code Splitting**: Lazy load dashboard components
- **Image Optimization**: Use responsive images and lazy loading
- **Data Pagination**: Limit initial data fetch size
- **Memoization**: Cache expensive computations (tree statistics)

## Security Considerations

- **Authentication**: Verify user authentication before loading dashboard
- **Authorization**: Ensure user has permission to view displayed data
- **Data Sanitization**: Sanitize all user-generated content before display
- **XSS Prevention**: Use React's built-in XSS protection
- **CSRF Protection**: Include CSRF tokens in API requests

## API Endpoints

### GET /api/dashboard

Fetch all dashboard data in a single request.

**Response:**
```typescript
{
  user: User;
  recentUpdates: Update[];
  upcomingEvents: Event[];
  memorySpotlight: Memory;
  treeStats: TreeStats;
  onlineUsers: OnlineUser[];
}
```

### GET /api/dashboard/updates

Fetch recent updates (for refresh).

**Query Parameters:**
- `limit`: number (default 10)
- `since`: ISO timestamp (for incremental updates)

### GET /api/dashboard/events

Fetch upcoming events.

**Query Parameters:**
- `limit`: number (default 5)
- `from`: ISO date (default today)

### GET /api/dashboard/online

Fetch currently online users.

**Response:**
```typescript
{
  onlineUsers: OnlineUser[];
  totalOnline: number;
}
```

### POST /api/memories/:id/favorite

Toggle favorite status of a memory.

**Request Body:**
```typescript
{
  isFavorite: boolean;
}
```

## Responsive Design Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1023px (two columns)
- **Desktop**: >= 1024px (three columns with sidebar)

### Layout Adjustments

**Mobile:**
- Stack all sections vertically
- Collapse navigation to hamburger menu
- Full-width cards
- Reduce padding and margins

**Tablet:**
- Two-column grid for main content
- Sidebar moves below main content
- Larger touch targets

**Desktop:**
- Three-column layout
- Fixed sidebar on right
- Hover states enabled
- Larger content areas

## Accessibility Requirements

- **WCAG 2.1 Level AA Compliance**
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Alternative Text**: Descriptive alt text for all images
- **Error Identification**: Clear error messages with suggestions

## Future Enhancements

- Real-time updates via WebSocket
- Customizable dashboard layout (drag-and-drop widgets)
- Personalized content recommendations
- Advanced filtering and search
- Dashboard themes and customization
- Export dashboard data (PDF, CSV)
- Mobile app with push notifications
