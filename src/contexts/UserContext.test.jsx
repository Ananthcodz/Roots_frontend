import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';
import UserService from '../services/UserService';

// Mock UserService
vi.mock('../services/UserService');

// Mock environment variable to disable mock mode
vi.stubEnv('VITE_MOCK_API', 'false');

describe('UserContext Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update profile correctly', async () => {
    const mockProfileData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      placeOfBirth: 'New York'
    };

    const mockResponse = {
      ...mockProfileData,
      userId: 'user-123',
      isComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    UserService.updateProfile.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      const updatedProfile = await result.current.updateProfile(mockProfileData);
      expect(updatedProfile).toEqual(mockResponse);
    });

    await waitFor(() => {
      expect(result.current.profile).toEqual(mockResponse);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle photo upload correctly', async () => {
    const mockFile = new File(['mock image content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const mockPhotoUrl = 'https://example.com/photo.jpg';
    UserService.uploadPhoto.mockResolvedValue(mockPhotoUrl);

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    await act(async () => {
      const photoUrl = await result.current.uploadProfilePhoto(mockFile);
      expect(photoUrl).toBe(mockPhotoUrl);
    });

    await waitFor(() => {
      expect(result.current.profile.photoUrl).toBe(mockPhotoUrl);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should manage loading state during profile update', async () => {
    const mockProfileData = {
      firstName: 'John',
      lastName: 'Doe'
    };

    UserService.updateProfile.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockProfileData), 100))
    );

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.updateProfile(mockProfileData);
    });

    // Should be loading immediately after calling updateProfile
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    // Should stop loading after update completes
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 200 });
  });

  it('should handle errors during profile update', async () => {
    const mockProfileData = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const error = new Error('Failed to update profile');
    UserService.updateProfile.mockRejectedValue(error);

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    await expect(async () => {
      await act(async () => {
        await result.current.updateProfile(mockProfileData);
      });
    }).rejects.toThrow('Failed to update profile');

    expect(result.current.isLoading).toBe(false);
  });

  it('should handle errors during photo upload', async () => {
    const mockFile = new File(['mock image content'], 'test.jpg', {
      type: 'image/jpeg',
    });

    const error = new Error('Upload failed');
    UserService.uploadPhoto.mockRejectedValue(error);

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    await expect(async () => {
      await act(async () => {
        await result.current.uploadProfilePhoto(mockFile);
      });
    }).rejects.toThrow('Upload failed');

    expect(result.current.isLoading).toBe(false);
  });

  it('should throw error when useUser is used outside UserProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      renderHook(() => useUser());
    }).toThrow('useUser must be used within a UserProvider');

    console.error = originalError;
  });
});
