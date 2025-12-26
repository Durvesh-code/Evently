import React, { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import './Modal.css';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import the forms
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AdminRegisterPage from '../pages/AdminRegisterPage';
import VendorRegisterPage from '../pages/VendorRegisterPage'; // 1. IMPORT IT

function Modal() {
  const { modalType, closeModal } = useContext(ModalContext);

  return (
    <div className="modal-overlay" onClick={closeModal} 
         style={{ display: modalType ? 'flex' : 'none' }}>
      
      {/* --- Login Modal (no change) --- */}
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ display: modalType === 'login' ? 'block' : 'none' }}
        // ... (animation props)
      >
        <button className="modal-close-button" onClick={closeModal}>
          <FaTimes />
        </button>
        <LoginPage />
      </motion.div>

      {/* --- Register Modal (no change) --- */}
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ display: modalType === 'register' ? 'block' : 'none' }}
        // ... (animation props)
      >
        <button className="modal-close-button" onClick={closeModal}>
          <FaTimes />
        </button>
        <RegisterPage />
      </motion.div>

      {/* --- Admin Register Modal (no change) --- */}
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ display: modalType === 'adminRegister' ? 'block' : 'none' }}
        // ... (animation props)
      >
        <button className="modal-close-button" onClick={closeModal}>
          <FaTimes />
        </button>
        <AdminRegisterPage />
      </motion.div>

      {/* --- 2. ADD THIS NEW VENDOR REGISTER MODAL --- */}
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ display: modalType === 'vendorRegister' ? 'block' : 'none' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <button className="modal-close-button" onClick={closeModal}>
          <FaTimes />
        </button>
        <VendorRegisterPage />
      </motion.div>

    </div>
  );
}

export default Modal;