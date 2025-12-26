import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, FaCalendarAlt, FaPlusSquare, FaUsers, 
  FaTicketAlt, FaChartBar, FaCog, FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

// 1. Get state and the 'setter' function from props
function AdminSidebar({ isCollapsed, setIsCollapsed }) {

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    // 2. The 'collapsed' class is controlled by props
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      
      {/* 3. This header and button structure is from your example */}
      <div className="sidebar-header">
        {!isCollapsed && <h2>Admin Dashboard</h2>}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>
      
      <nav>
        {/* 4. This is your link and tooltip structure */}
        <NavLink to="/admin" end className="admin-sidebar-link">
          <div className="icon-wrapper">
            <FaHome />
          </div>
          {!isCollapsed && <span>Overview</span>}
          {isCollapsed && <div className="tooltip">Overview</div>}
        </NavLink>
        
        <NavLink to="/create-event" className="admin-sidebar-link">
          <div className="icon-wrapper">
            <FaPlusSquare />
          </div>
          {!isCollapsed && <span>Create New Event</span>}
          {isCollapsed && <div className="tooltip">Create New Event</div>}
        </NavLink>
        
        
        <NavLink to="/admin/settings" className="admin-sidebar-link">
          <div className="icon-wrapper">
            <FaCog />
          </div>
          {!isCollapsed && <span>Settings</span>}
          {isCollapsed && <div className="tooltip">Settings</div>}
        </NavLink>
      </nav>
    </div>
  );
}

export default AdminSidebar;