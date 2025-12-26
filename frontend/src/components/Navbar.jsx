import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import {
  FaCalendarAlt,
  FaUser,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
  FaTicketAlt,
  FaStore,
  FaCheckCircle, // 1. Import a new icon
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { openModal } = useContext(ModalContext);

  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // ... (useEffect, handleLogout, isSolid... all remain the same) ...
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const handleLogout = () => {
    logout();
    navigate("/"); // Navigate to homepage on logout
  };

  const isSolid = !isHomePage || isScrolled;

  // --- 2. This function will clean up the render logic ---
  const renderLoggedInLinks = () => {
    // --- ADMIN LINKS ---
    if (user.role === "ROLE_ADMIN") {
      return (
        <>
          <Link to="/admin" className="nav-link">
            <FaUserCircle />
            <span>Dashboard</span>
          </Link>
          <Link to="/profile" className="nav-link">
            <FaUserCircle />
            <span>Profile</span>
          </Link>
        </>
      );
    }

    // --- VENDOR LINKS ---
    if (user.role === "ROLE_VENDOR") {
      return (
        <>
          <Link to="/vendor/dashboard" className="nav-link">
            <FaUserCircle />
            <span>Dashboard</span>
          </Link>
          {/* This is the new link you wanted */}
          <Link to="/vendor/verify" className="nav-link">
            <FaCheckCircle />
            <span>Get Verified</span>
          </Link>
          <Link to="/profile" className="nav-link">
            <FaUserCircle />
            <span>Profile</span>
          </Link>
        </>
      );
    }

    // --- REGULAR USER LINKS ---
    return (
      <>
        <Link to="/dashboard" className="nav-link">
          <FaUserCircle />
          <span>Dashboard</span>
        </Link>
        <Link to="/profile" className="nav-link">
          <FaUserCircle />
          <span>Profile</span>
        </Link>
      </>
    );
  };

  return (
    <nav className={`navbar ${isSolid ? "scrolled" : ""}`}>
      <Link to="/" className="navbar-logo">
        <FaCalendarAlt />
        Evently
      </Link>

      <div className="navbar-links">
        <Link to="/events" className="nav-link">
          <FaTicketAlt />
          <span>Events</span>
        </Link>

        {/* --- ADD THIS NEW LINK --- */}
        <Link to="/vendors" className="nav-link">
          <FaStore />
          <span>Vendors</span>
        </Link>

        {user ? (
          // === 3. Links shown WHEN LOGGED IN ===
          <>
            {renderLoggedInLinks()} {/* Call our new function */}
            <button onClick={handleLogout} className="nav-link-button">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
            <span className="navbar-welcome">Welcome, {user.username}!</span>
          </>
        ) : (
          // === Links shown WHEN LOGGED OUT (no change) ===
          <>
            <button
              className="nav-link-button"
              onClick={() => openModal("login")}
            >
              <FaUser />
              <span>Login</span>
            </button>
            <button
              className="nav-link-button"
              onClick={() => openModal("register")}
            >
              <FaUserPlus />
              <span>Register</span>
            </button>
            <button
              className="nav-link-button"
              onClick={() => openModal("vendorRegister")}
            >
              <FaStore />
              <span>Become a Vendor</span>
            </button>
            <button
              className="nav-link-button"
              onClick={() => openModal("adminRegister")}
            >
              <FaUserPlus />
              <span>Admin Register</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
