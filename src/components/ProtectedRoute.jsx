import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }

  if (!isAuthenticated) {
    // Redirect to sign-in, but save the location they were trying to access
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
