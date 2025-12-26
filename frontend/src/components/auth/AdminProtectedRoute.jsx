import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const AdminProtectedRoute = () => {
  // 1. We must get the 'loading' state
  const { user, loading } = useContext(AuthContext);

  // 2. We add this check. If it's loading, show nothing.
  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // 3. If not loading AND user is not found, redirect to homepage
  if (!user) {
    return <Navigate to="/" replace />; // This is the correct redirect
  }

  // 4. If user is logged in BUT NOT an admin, redirect to user dashboard
  if (user.role !== 'ROLE_ADMIN') {
    return <Navigate to="/dashboard" replace />; // Send them to their dashboard
  }

  // 5. If user is an admin, show the page
  return <Outlet />;
};

export default AdminProtectedRoute;