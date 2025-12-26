import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from '../api/axiosConfig'; // 1. Import api
import "./UserDashboard.css";
import { FaCalendarCheck, FaLightbulb } from "react-icons/fa";

function UserDashboard() {
  const { user } = useContext(AuthContext);
  
  // 2. Add state for bookings and loading
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Add useEffect to fetch bookings
  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          setLoading(true);
          const response = await api.get('/bookings/my-bookings');
          setBookings(response.data);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [user]); // Re-run if user logs in

  if (!user) {
    return <div>Loading...</div>; // Still loading user
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.username}!</h2>
        <p>Here are your upcoming events and recommendations.</p>
      </div>

      <div className="dashboard-grid">
        {/* Card 1: Upcoming Events (NOW REAL DATA) */}
        <div className="dashboard-card">
          <h3>
            <FaCalendarCheck /> My Upcoming Events
          </h3>
          {/* 4. Render real data */}
          {loading ? (
            <p>Loading your bookings...</p>
          ) : bookings.length === 0 ? (
            <p>You have no upcoming events.</p>
          ) : (
            bookings.map(booking => (
              <div key={booking.bookingId} className="event-list-item">
                <span>{booking.eventName}</span>
                <span className="date">{new Date(booking.eventDate).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>

        {/* Card 2: AI Recommendations (Same as before) */}
        <div className="dashboard-card">
          <h3>
            <FaLightbulb /> AI Recommendations
          </h3>
          <p>Based on your preferences, we suggest these top-rated vendors:</p>
          <ul>
            <li>Starlight Banquet Hall (Venue)</li>
            <li>TasteBuds Caterers (Catering)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;