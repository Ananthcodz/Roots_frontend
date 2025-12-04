import { createContext, useContext, useState } from 'react';
import MemoryService from '../services/MemoryService';

const MemoryContext = createContext(null);

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  return context;
};

export const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Mock mode for development (when no backend is available)
  const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

  const uploadPhotos = async (files, memoryData, onProgress) => {
    try {
      setIsLoading(true);
      setError(null);
      setUploadProgress(0);

      if (MOCK_MODE) {
        // Mock response for development with progress simulation
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(i);
          if (onProgress) onProgress(i);
        }
        
        const photoUrls = files.map((file, index) => 
          URL.createObjectURL(file)
        );
        
        const newMemory = {
          id: 'mock-memory-' + Date.now(),
          uploadedBy: 'mock-user-id',
          albumId: memoryData.albumId || null,
          location: memoryData.location || null,
          dateTaken: memoryData.dateTaken || null,
          description: memoryData.description || null,
          photoUrls,
          taggedPeople: memoryData.taggedPeople || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setMemories(prev => [...prev, newMemory]);
        setUploadProgress(100);
        return newMemory;
      }

      const result = await MemoryService.uploadPhotos(files, memoryData, (progress) => {
        setUploadProgress(progress);
        if (onProgress) onProgress(progress);
      });
      
      setMemories(prev => [...prev, result]);
      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to upload photos');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createMemory = async (memoryData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const newMemory = {
          id: 'mock-memory-' + Date.now(),
          uploadedBy: 'mock-user-id',
          ...memoryData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMemories(prev => [...prev, newMemory]);
        return newMemory;
      }

      const newMemory = await MemoryService.createMemory(memoryData);
      setMemories(prev => [...prev, newMemory]);
      return newMemory;
    } catch (err) {
      setError(err.message || 'Failed to create memory');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAlbums = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockAlbums = [
          {
            id: 'mock-album-1',
            name: 'Family Gatherings',
            description: 'Special family moments',
            coverPhotoUrl: null,
            createdBy: 'mock-user-id',
            createdAt: new Date().toISOString(),
            photoCount: 0,
          },
          {
            id: 'mock-album-2',
            name: 'Holidays',
            description: 'Holiday celebrations',
            coverPhotoUrl: null,
            createdBy: 'mock-user-id',
            createdAt: new Date().toISOString(),
            photoCount: 0,
          },
        ];
        setAlbums(mockAlbums);
        return mockAlbums;
      }

      const albumList = await MemoryService.getAlbums();
      setAlbums(albumList);
      return albumList;
    } catch (err) {
      setError(err.message || 'Failed to fetch albums');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchFamilyMembers = async (query) => {
    try {
      setError(null);

      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockMembers = [
          {
            id: 'mock-member-1',
            firstName: 'John',
            lastName: 'Doe',
            photoUrl: null,
          },
          {
            id: 'mock-member-2',
            firstName: 'Jane',
            lastName: 'Smith',
            photoUrl: null,
          },
        ];
        
        // Filter by query
        const filtered = mockMembers.filter(member =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(query.toLowerCase())
        );
        
        return filtered;
      }

      const results = await MemoryService.searchMembers(query);
      return results;
    } catch (err) {
      setError(err.message || 'Failed to search family members');
      throw err;
    }
  };

  const value = {
    memories,
    albums,
    isLoading,
    uploadProgress,
    error,
    uploadPhotos,
    createMemory,
    getAlbums,
    searchFamilyMembers,
  };

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>;
};

export default MemoryContext;
