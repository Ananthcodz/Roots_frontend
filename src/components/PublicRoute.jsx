import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }

  // If user is authenticated, redirect them away from auth pages
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicRoute;
