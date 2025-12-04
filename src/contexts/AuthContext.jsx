import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock mode for development (when no backend is available)
  const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // TODO: Validate token and fetch user data
      setIsAuthenticated(true);
      
      // In mock mode, restore mock user
      if (MOCK_MODE) {
        const mockUser = JSON.parse(localStorage.getItem('mockUser') || 'null');
        if (mockUser) {
          setUser(mockUser);
        }
      }
    }
    setIsLoading(false);
  }, [MOCK_MODE]);

  const signUp = async (email, password, fullName) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email,
          fullName,
          authProvider: 'email',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: false
        };
        const mockToken = 'mock-token-' + Date.now();
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return mockUser;
      }
      
      const response = await AuthService.register(email, password, fullName);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email,
          fullName: email.split('@')[0], // Use email prefix as name
          authProvider: 'email',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: true
        };
        const mockToken = 'mock-token-' + Date.now();
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return mockUser;
      }
      
      const response = await AuthService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const mockUser = {
          id: 'mock-user-google-' + Date.now(),
          email: 'user@gmail.com',
          fullName: 'Google User',
          authProvider: 'google',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: true
        };
        const mockToken = 'mock-token-google-' + Date.now();
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return mockUser;
      }
      
      const response = await AuthService.loginWithGoogle();
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (MOCK_MODE) {
        // Mock response for development
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const mockUser = {
          id: 'mock-user-apple-' + Date.now(),
          email: 'user@icloud.com',
          fullName: 'Apple User',
          authProvider: 'apple',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          emailVerified: true
        };
        const mockToken = 'mock-token-apple-' + Date.now();
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockToken);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return mockUser;
      }
      
      const response = await AuthService.loginWithApple();
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Apple');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      if (MOCK_MODE) {
        // Mock sign out
        await new Promise(resolve => setTimeout(resolve, 200));
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('mockUser');
        return;
      }
      
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err) {
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.requestPasswordReset(email);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (token, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.resetPassword(token, newPassword);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
