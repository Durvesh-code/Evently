import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css'; // Import the layout CSS

function AdminLayout() {
  // 1. The 'isCollapsed' state now lives in the parent layout
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    // 2. The 'collapsed' class is applied to the main wrapper
    <div className={`admin-layout ${isCollapsed ? 'collapsed' : ''}`}>
      
      {/* 3. State is passed down to the Sidebar */}
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />

      {/* 4. The content area will be moved by the CSS */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;