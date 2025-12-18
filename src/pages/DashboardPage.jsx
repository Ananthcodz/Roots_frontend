import { useState } from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import NavigationBar from '../components/NavigationBar';
import RecentUpdates from '../components/RecentUpdates';
import QuickActions from '../components/QuickActions';
import UpcomingEvents from '../components/UpcomingEvents';
import OnlineNow from '../components/OnlineNow';
import AddRelativeModal from '../components/AddRelativeModal';
import './DashboardPage.css';

const DashboardContent = () => {
  const { user } = useAuth();
  const { profile } = useUser();
  const [isAddRelativeModalOpen, setIsAddRelativeModalOpen] = useState(false);
  
  // Get user's first name from profile or auth user
  const firstName = profile?.firstName || user?.fullName?.split(' ')[0] || 'User';
  const fullName = profile?.firstName && profile?.lastName 
    ? `${profile?.firstName} ${profile?.lastName}` 
    : user?.fullName || 'User';

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

  const handleUserClick = (userId) => {
    console.log('User clicked:', userId);
  };

  return (
    <div className="dashboard-page">
      <NavigationBar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header Section with Greeting */}
          <div className="dashboard-header">
            <h1 className="dashboard-greeting">Good Morning, {firstName}</h1>
            <p className="dashboard-date">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • You have 3 new updates
            </p>
          </div>

          {/* Quick Actions Row */}
          <div className="dashboard-quick-actions-row">
            <QuickActions onActionClick={(actionId) => {
              if (actionId === 'add-relative') {
                setIsAddRelativeModalOpen(true);
                return false; // Prevent navigation
              }
            }} />
          </div>

          {/* Add Relative Modal */}
          <AddRelativeModal 
            isOpen={isAddRelativeModalOpen} 
            onClose={() => setIsAddRelativeModalOpen(false)}
            userName={fullName}
          />

          {/* Main Content Grid */}
          <div className="dashboard-grid">
            {/* Left Column - Latest Activity */}
            <div className="dashboard-main-content">
              <RecentUpdates updates={mockUpdates} onViewAll={handleViewAll} />
            </div>

            {/* Right Column - Up Next & Online Now */}
            <div className="dashboard-sidebar">
              <UpcomingEvents
                events={mockEvents}
                onCalendarClick={handleCalendarClick}
                onEventClick={handleEventClick}
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
