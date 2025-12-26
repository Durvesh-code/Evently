import React, { useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { ModalContext } from '../context/ModalContext';

function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const { openModal, closeModal } = useContext(ModalContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // This will now match the simplified backend
      const response = await api.post('/auth/register/vendor', formData);
      setMessage(response.data);
      
      setTimeout(() => {
        closeModal(); // Close this modal
        openModal('login'); // Open login modal
      }, 2000);

    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  const switchToLogin = () => {
    closeModal();
    openModal('login');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Vendor Registration</h2>
        {message && <p className="message">{message}</p>}
        
        {/* User Fields */}
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        
        {/* --- All other fields are removed --- */}

        <button type="submit" className="auth-button">Register as Vendor</button>
      </form>

      <div className="auth-switch">
        Already have an account?{' '}
        <button onClick={switchToLogin} className="auth-switch-link">
          Login
        </button>
      </div>
    </div>
  );
}

export default VendorRegisterPage;