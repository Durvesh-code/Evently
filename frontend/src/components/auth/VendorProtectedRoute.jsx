import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const VendorProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking user
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // This check is fine, it redirects Admins or Users away
  if (user.role !== 'ROLE_VENDOR') {
    return <Navigate to="/dashboard" replace />;
  }

  const isVerified = user.isVerified;
  const currentPath = location.pathname;

  // --- Logic for UNVERIFIED vendors ---
  if (!isVerified) {
    // If NOT verified, they are ONLY allowed on the /vendor/verify page.
    if (currentPath !== '/vendor/verify') {
      // If they are anywhere else (like /profile or /vendor/dashboard), force them to the verify page.
      return <Navigate to="/vendor/verify" replace />;
    }
    // If they are already on the verify page, let them stay.
    return <Outlet />;
  }

  // --- THIS IS THE FIX ---
  // The redirect logic for verified vendors has been removed.
  // We now allow verified vendors to visit any vendor route.
  return <Outlet />;
};

export default VendorProtectedRoute;