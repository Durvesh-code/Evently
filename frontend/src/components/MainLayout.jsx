import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../App.css';
import Chatbot from './Chatbot'; // <-- Import

function MainLayout() {
  const location = useLocation();
  
  let wrapperClass = '';
  if (location.pathname.startsWith('/events')) {
    wrapperClass = 'events-page-wrapper';
  } else if (location.pathname === '/') {
    wrapperClass = 'homepage-wrapper';
  }

  return (
    <div className={wrapperClass}>
      <main className="page-content">
        <Outlet />
      </main>
      
      {/* Add Chatbot here */}
      <Chatbot />
    </div>
  );
}

export default MainLayout;