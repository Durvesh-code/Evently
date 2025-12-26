import React, { useState, useContext } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { openModal, closeModal } = useContext(ModalContext); // 1. Get open/close

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };
  // This is the new, correct handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await api.post("/auth/login", formData);
      const userData = response.data; // This has your {user, role, token}, etc.

      login(userData); // Log the user in
      setMessage(userData.message);

      // --- THIS IS THE FIX ---
      // Check the user's role and navigate to the correct dashboard
      setTimeout(() => {
        closeModal(); // Close the modal

        if (userData.role === "ROLE_ADMIN") {
          navigate("/admin");
        } else if (userData.role === "ROLE_VENDOR") {
          navigate("/vendor/dashboard"); // <-- This is the new logic
        } else {
          navigate("/dashboard");
        }
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage("Login failed. Please try again.");
      }
    }
  };

  // 2. Add this new function
  const switchToRegister = () => {
    closeModal();
    openModal("register");
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}

        {/* ... (all your form-groups are the same) ... */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Login
        </button>
      </form>

      {/* 3. Add this new "switch" link at the bottom */}
      <div className="auth-switch">
        Don't have an account?{" "}
        <button onClick={switchToRegister} className="auth-switch-link">
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;