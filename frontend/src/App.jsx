import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import './App.css';

// === LAYOUTS ===
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// === PAGES ===
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import CreateEventPage from './pages/CreateEventPage';
import VendorVerificationPage from './pages/VendorVerificationPage';
import VendorDashboard from './pages/VendorDashboard';      // ✅ Added
import VendorsListPage from './pages/VendorsListPage';      // ✅ Added

// === PROTECTED ROUTES ===
import UserProtectedRoute from './components/auth/UserProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import VendorProtectedRoute from './components/auth/VendorProtectedRoute';

function App() {
  return (
    <div>
      <Navbar />
      <Modal />
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/vendors" element={<VendorsListPage />} /> {/* ✅ New route for public vendor list */}
        </Route>

        {/* === 1. ADMIN ROUTES (Most Specific) === */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<p>Event Management Page (Placeholder)</p>} />
            <Route path="users" element={<p>User Management Page (Placeholder)</p>} />
            <Route path="bookings" element={<p>Bookings Page (Placeholder)</p>} />
            <Route path="reports" element={<p>Reports Page (Placeholder)</p>} />
            <Route path="settings" element={<p>Settings Page (Placeholder)</p>} />
          </Route>

          {/* Admin additional routes that use MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/create-event" element={<CreateEventPage />} />
          </Route>
        </Route>

        {/* === 2. VENDOR ROUTES (Second Most Specific) === */}
        <Route element={<VendorProtectedRoute />}>
          <Route element={<MainLayout />}>
            {/* ✅ Replaced placeholder with real Vendor Dashboard */}
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/verify" element={<VendorVerificationPage />} />
          </Route>
        </Route>

        {/* === 3. USER ROUTES (General) === */}
        <Route element={<UserProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
        </Route>

        {/* === 4. UNIFIED PROFILE ROUTE (For all authenticated users) === */}
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;
