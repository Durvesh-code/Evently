import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import './EventsPage.css'; // We reuse the event card styles
import { motion } from 'framer-motion';

// --- 1. UNCOMMENT THIS LINE ---
import EnquiryModal from '../components/EnquiryModal.jsx'; 

function VendorsListPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // This state will control the modal
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vendors');
        setVendors(response.data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // --- 2. DELETE THE ENTIRE PLACEHOLDER FUNCTION ---
  /*
  const EnquiryModal = ({ vendor, onClose }) => {
    // ... all the placeholder code is gone ...
  };
  */

  return (
    <div className="events-page-container">
      <h1>Find Vendors</h1>
      <p>Browse our list of verified event professionals.</p>

      {/* This component will be invisible until a vendor is selected */}
      <EnquiryModal vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />

      {loading ? (
        <h1>Loading Vendors...</h1>
      ) : vendors.length === 0 ? (
        <h1>No vendors are verified yet.</h1>
      ) : (
        <motion.div
          className="event-grid"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {vendors.map((vendor) => (
            <motion.div
              className="event-card"
              key={vendor.id}
              variants={cardVariants}
            >
              <div className="event-card-link">
                <div className="event-card-image-container">
                  <img
                    className="static-image"
                    src={
                      vendor.portfolioImageUrls && vendor.portfolioImageUrls.length > 0
                        ? `http://localhost:8081${vendor.portfolioImageUrls[0]}`
                        : "https://placehold.co/400x500/0f0f23/FF00FF?text=No+Image"
                    }
                    alt={vendor.companyName}
                  />
                </div>

                <div className="event-card-content">
                  <h3>{vendor.companyName}</h3>
                  <p>{vendor.about ? vendor.about.substring(0, 100) + '...' : 'No description available.'}</p>
                  
                  <button 
                    className="auth-button" 
                    style={{marginTop: 'auto'}}
                    onClick={() => setSelectedVendor(vendor)}
                  >
                    Send Enquiry
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default VendorsListPage;