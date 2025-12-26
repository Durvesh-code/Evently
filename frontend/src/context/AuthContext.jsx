import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

const sessionDuration = 86400000; // 24 hours in milliseconds
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- 1. Use useRef for the timer ID ---
  // This will not cause a re-render when it's set.
  const sessionTimerId = useRef(null);

  // --- 2. Update logout to use the ref ---
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setUser(null);

    // Clear the timer using the ref's current value
    if (sessionTimerId.current) {
      clearTimeout(sessionTimerId.current);
      sessionTimerId.current = null;
    }
    console.log("Session terminated, user logged out.");
  }, []); // <-- 3. The dependency array is now empty, so logout is stable

  // This effect listens for the 401 error interceptor
  useEffect(() => {
    const handleForceLogout = () => {
      console.log("Force-logout event received from interceptor.");
      logout();
    };
    window.addEventListener('force-logout', handleForceLogout);
    return () => {
      window.removeEventListener('force-logout', handleForceLogout);
    };
  }, [logout]); // <-- 4. This dependency is now stable

  // This effect checks the session on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const loginTime = localStorage.getItem('loginTime');

    if (storedToken && storedUser && loginTime) {
      try {
        const expiryTime = parseInt(loginTime) + sessionDuration;
        const timeRemaining = expiryTime - new Date().getTime();

        if (timeRemaining <= 0) {
          console.log("Session expired on load, logging out.");
          logout();
        } else {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // 5. Set the timer using the ref
          sessionTimerId.current = setTimeout(logout, timeRemaining);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]); // <-- 4. This dependency is also stable

  // --- 6. Update login to use the ref ---
  const login = (userData) => {
    const { token, ...userDetails } = userData;

    // Clear any old timer
    if (sessionTimerId.current) {
      clearTimeout(sessionTimerId.current);
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userDetails));
    localStorage.setItem('loginTime', new Date().getTime());
    setUser(userDetails);

    // Set the new timer
    sessionTimerId.current = setTimeout(logout, sessionDuration);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };