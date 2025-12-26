import React, { useState, useEffect } from 'react'; // 1. Import hooks
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // We re-use the same dashboard card styles
import { FaCalendarAlt, FaUsers, FaTicketAlt, FaDollarSign } from 'react-icons/fa';
import api from '../api/axiosConfig'; // 2. Import api

function AdminDashboard() {
  const navigate = useNavigate();
  
  // 3. Create state to hold the real data
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 4. Fetch the stats when the page loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This is the new endpoint we just created
        const response = await api.get('/admin/stats/totals'); 
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        // This could happen if the user's token is expired or they are not an admin
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []); // The empty array means this runs only once

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Here are your key analytics at a glance.</p>
      </div>

      {/* Analytics Cards */}
      <div className="dashboard-grid">
        
        {/* Card 1: Total Events (NOW REAL DATA) */}
        <div className="dashboard-card">
          <h3><FaCalendarAlt /> Total Events</h3>
          {/* 5. Show loading state or real data */}
          <h1>{loading ? '...' : (stats ? stats.totalEvents : 0)}</h1>
          <p>Active and upcoming events</p>
        </div>

        {/* Card 2: Total Users (NOW REAL DATA) */}
        <div className="dashboard-card">
          <h3><FaUsers /> Total Users</h3>
          {/* 5. Show loading state or real data */}
          <h1>{loading ? '...' : (stats ? stats.totalUsers : 0)}</h1>
          <p>Registered users</p>
        </div>

        {/* Card 3: Tickets Sold (Still Placeholder) */}
        <div className="dashboard-card">
          <h3><FaTicketAlt /> Tickets Sold</h3>
          <h1>0</h1>
          <p>In the last 30 days (Placeholder)</p>
        </div>
        
        {/* Card 4: Revenue (Still Placeholder) */}
        <div className="dashboard-card">
          <h3><FaDollarSign /> Total Revenue</h3>
          <h1>₹0</h1>
          <p>In the last 30 days (Placeholder)</p>
        </div>

      </div>
      
      {/* TODO: We will add the 📊 Charts here later */}
    </div>
  );
}

export default AdminDashboard;