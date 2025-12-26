import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './UserDashboard.css'; // We can reuse the same CSS
import { FaEnvelope } from 'react-icons/fa';

function VendorDashboard() {
  const { user } = useContext(AuthContext);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vendor/my-enquiries');
        setEnquiries(response.data);
      } catch (error) {
        console.error("Failed to fetch enquiries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user.username}!</h2>
        <p>Here are your new customer enquiries.</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3><FaEnvelope /> My Enquiries ({enquiries.length})</h3>
          {loading ? (
            <p>Loading enquiries...</p>
          ) : enquiries.length === 0 ? (
            <p>You have no new enquiries.</p>
          ) : (
            enquiries.map(enq => (
              <div key={enq.id} className="event-list-item" style={{alignItems: 'flex-start', flexDirection: 'column', gap: '5px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                  <span>{enq.customerName} ({enq.customerEmail})</span>
                  <span className="date">{new Date(enq.submittedAt).toLocaleDateString()}</span>
                </div>
                <p style={{margin: 0, color: '#fff'}}>{enq.message}</p>
                {enq.eventDate && <small>Event Date: {new Date(enq.eventDate).toLocaleDateString()}</small>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorDashboard;