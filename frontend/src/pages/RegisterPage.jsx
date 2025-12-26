import React, { useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { ModalContext } from '../context/ModalContext';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
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
      const response = await api.post('/auth/register/user', formData);
      setMessage(response.data);
      
      setTimeout(() => {
        closeModal(); // 3. Close the register modal
        openModal('login'); // 4. Open the login modal
      }, 2000);

    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage('Registration failed. Please try again.');
      }
    }
  };

  // 1. Add this new function
  const switchToLogin = () => {
    closeModal();
    openModal('login');
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        
        {/* ... (all your form-groups are the same) ... */}
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

        <button type="submit" className="auth-button">Register</button>
      </form>

      {/* 2. Add this new "switch" link at the bottom */}
      <div className="auth-switch">
        Already have an account?{' '}
        <button onClick={switchToLogin} className="auth-switch-link">
          Login
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;