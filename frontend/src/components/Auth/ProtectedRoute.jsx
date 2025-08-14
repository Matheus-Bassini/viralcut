import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading, user } = useSelector(state => state.auth);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  // If route requires authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires no authentication but user is authenticated (like login/register pages)
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard or home
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  // If user is authenticated but email is not verified (for certain routes)
  if (requireAuth && isAuthenticated && user && !user.isEmailVerified) {
    const publicRoutes = ['/verify-email', '/profile', '/logout'];
    if (!publicRoutes.includes(location.pathname)) {
      return <Navigate to="/verify-email" replace />;
    }
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
