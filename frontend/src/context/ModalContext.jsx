import React, { createContext, useState } from 'react';

// 1. Create the Context
const ModalContext = createContext();

// 2. Create the Provider
const ModalProvider = ({ children }) => {
  // 'modalType' will be null, 'login', 'register', or 'adminRegister'
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  // 3. Pass down the state and functions
  return (
    <ModalContext.Provider value={{ modalType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };