import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const UserProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // --- THIS IS THE FIX ---
  // This component's only job is to protect USER routes.
  // If the role is NOT "ROLE_USER", they cannot be here.
  // This stops it from redirecting Admins and Vendors who are
  // trying to access their own /profile route.
  if (user.role !== 'ROLE_USER') {
    return <Navigate to="/" replace />;
  }

  // If you are a ROLE_USER, you can see the pages.
  return <Outlet />;
};

export default UserProtectedRoute;