import { DashboardProvider } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import NavigationBar from '../components/NavigationBar';
import Greeting from '../components/Greeting';
import RecentUpdates from '../components/RecentUpdates';
import QuickActions from '../components/QuickActions';
import UpcomingEvents from '../components/UpcomingEvents';
import MemorySpotlight from '../components/MemorySpotlight';
import OnlineNow from '../components/OnlineNow';
import TreeOverview from '../components/TreeOverview';
import './DashboardPage.css';

const DashboardContent = () => {
  const { user } = useAuth();
  const { profile } = useUser();
  
  // Get user's first name from profile or auth user
  const firstName = profile?.firstName || user?.fullName?.split(' ')[0] || 'User';

  // Mock data for Recent Updates
  const mockUpdates = [
    {
      id: '1',
      type: 'birthday',
      data: {
        relativeName: 'Elena Rivera',
        age: 54,
        date: new Date(2025, 9, 25).toISOString(),
      },
    },
    {
      id: '2',
      type: 'photo',
      data: {
        uploaderName: 'Antonio',
        albumName: 'Havana 1950s',
        photoUrls: [
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
          'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb',
        ],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
    },
    {
      id: '3',
      type: 'new_member',
      data: {
        relativeName: 'Sofia Rivera',
        joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  ];

  const handleViewAll = () => {
    console.log('View all updates');
  };

  // Removed handleActionClick - let QuickActions handle navigation directly

  // Mock data for Upcoming Events
  const mockEvents = [
    {
      id: '1',
      name: "Elena's Birthday",
      date: new Date(2025, 9, 25).toISOString(),
      time: 'All Day',
      isToday: false,
    },
    {
      id: '2',
      name: 'Family Dinner',
      date: new Date(2025, 9, 28).toISOString(),
      time: "6:00 PM • Grandma's",
      isToday: false,
    },
    {
      id: '3',
      name: 'Halloween',
      date: new Date(2025, 9, 31).toISOString(),
      time: "7:00 PM • Mike's House",
      isToday: false,
    },
  ];

  // Mock data for Memory Spotlight
  const mockMemory = {
    id: '1',
    title: 'Autumn Picnic',
    date: new Date(2023, 9, 24).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    uploaderName: 'Javier',
    isFavorite: false,
  };

  // Mock data for Online Users
  const mockOnlineUsers = [
    {
      id: '1',
      name: 'Maria',
      photoUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '2',
      name: 'Carlos',
      photoUrl: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: '3',
      name: 'Sofia',
      photoUrl: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: '4',
      name: 'Diego',
      photoUrl: null,
    },
  ];

  const handleCalendarClick = () => {
    console.log('Calendar clicked');
  };

  const handleEventClick = (eventId) => {
    console.log('Event clicked:', eventId);
  };

  const handleFavoriteToggle = (memoryId) => {
    console.log('Favorite toggled:', memoryId);
  };

  const handleMemoryClick = (memoryId) => {
    console.log('Memory clicked:', memoryId);
  };

  const handleUserClick = (userId) => {
    console.log('User clicked:', userId);
  };

  const handleTreeClick = (section) => {
    console.log('Tree section clicked:', section);
    // TODO: Navigate to family tree page
  };

  return (
    <div className="dashboard-page">
      <NavigationBar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header Section with Greeting */}
          <Greeting firstName={firstName} />

            {/* Main Content Grid */}
            <div className="dashboard-grid">
              {/* Left Column - Recent Updates, Calendar & Memory */}
              <div className="dashboard-main-content">
                <RecentUpdates updates={mockUpdates} onViewAll={handleViewAll} />
                
                <div className="dashboard-secondary-row">
                  <UpcomingEvents
                    events={mockEvents}
                    onCalendarClick={handleCalendarClick}
                    onEventClick={handleEventClick}
                  />

                  <MemorySpotlight
                    memory={mockMemory}
                    onFavoriteToggle={handleFavoriteToggle}
                    onMemoryClick={handleMemoryClick}
                  />
                </div>
              </div>

              {/* Right Sidebar - Quick Actions, Tree Overview, Online Now */}
              <div className="dashboard-sidebar">
                <QuickActions />
                
                <TreeOverview
                  memberCount={142}
                  generationCount={4}
                  onTreeClick={handleTreeClick}
                />
                
                <OnlineNow
                  onlineUsers={mockOnlineUsers}
                  onUserClick={handleUserClick}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

const DashboardPage = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default DashboardPage;
