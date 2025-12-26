import React, { useState } from 'react';
import api from '../api/axiosConfig';
import './Modal.css'; // Reuse modal styles
import '../index.css'; // Reuse form styles
import { motion } from 'framer-motion'; // Import motion

function EnquiryModal({ vendor, onClose }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    message: '',
  });
  const [responseMsg, setResponseMsg] = useState('');

  if (!vendor) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg('Sending...');

    const requestData = {
      ...formData,
      vendorId: vendor.id,
    };

    try {
      const response = await api.post('/enquiries', requestData);
      setResponseMsg(response.data);
      setTimeout(() => {
        onClose();
        setResponseMsg('');
      }, 2000);
    } catch (error) {
      setResponseMsg(error.response?.data || 'Failed to send enquiry.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="auth-container">
          <form onSubmit={handleSubmit}>
            <h2>Enquiry for {vendor.companyName}</h2>
            {responseMsg && <p className="message">{responseMsg}</p>}
            
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="customerName" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Your Email</label>
              <input type="email" name="customerEmail" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Your Phone</label>
              <input type="tel" name="customerPhone" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Event Date (Optional)</label>
              <input type="date" name="eventDate" onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea name="message" onChange={handleChange} required style={{minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem'}} />
            </div>
            <button type="submit" className="auth-button">Send Enquiry</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default EnquiryModal;