import { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext(null);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock mode for development
  const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

  // Section-specific loading states
  const [sectionLoading, setSectionLoading] = useState({
    recentUpdates: false,
    upcomingEvents: false,
    memorySpotlight: false,
    treeStats: false,
    onlineUsers: false,
  });

  // Section-specific error states
  const [sectionErrors, setSectionErrors] = useState({
    recentUpdates: null,
    upcomingEvents: null,
    memorySpotlight: null,
    treeStats: null,
    onlineUsers: null,
  });

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = {
          user: {
            id: 'mock-user-1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            photoUrl: null,
          },
          recentUpdates: [],
          upcomingEvents: [],
          memorySpotlight: null,
          treeStats: {
            memberCount: 0,
            generationCount: 0,
          },
          onlineUsers: [],
        };
        setDashboardData(mockData);
        return mockData;
      }

      // TODO: Implement actual API call
      // const data = await DashboardService.getDashboardData();
      // setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDashboard = async () => {
    await loadDashboardData();
  };

  const handleSectionError = (section, error) => {
    setSectionErrors(prev => ({
      ...prev,
      [section]: error,
    }));
  };

  const clearSectionError = (section) => {
    setSectionErrors(prev => ({
      ...prev,
      [section]: null,
    }));
  };

  const value = {
    dashboardData,
    isLoading,
    error,
    sectionLoading,
    sectionErrors,
    refreshDashboard,
    handleSectionError,
    clearSectionError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext;
