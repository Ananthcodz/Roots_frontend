import { createContext, useContext, useState } from 'react';
import UserService from '../services/UserService';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock mode for development (when no backend is available)
  const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

  const updateProfile = async (data) => {
    try {
      setIsLoading(true);
      
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const updatedProfile = {
          ...data,
          userId: 'mock-user-id',
          isComplete: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProfile(updatedProfile);
        return updatedProfile;
      }
      
      const updatedProfile = await UserService.updateProfile(data);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProfilePhoto = async (file) => {
    try {
      setIsLoading(true);
      
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const photoUrl = URL.createObjectURL(file);
        setProfile((prev) => ({ ...prev, photoUrl }));
        return photoUrl;
      }
      
      const photoUrl = await UserService.uploadPhoto(file);
      setProfile((prev) => ({ ...prev, photoUrl }));
      return photoUrl;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    profile,
    isLoading,
    updateProfile,
    uploadProfilePhoto,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
