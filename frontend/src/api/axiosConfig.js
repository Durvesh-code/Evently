import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy will handle this
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- ADD THIS NEW RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Check if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.error("401 Unauthorized, dispatching force-logout.");
      // Dispatch a custom event that the AuthContext will listen for
      // This is the cleanest way to communicate with React context
      window.dispatchEvent(new Event('force-logout'));
    }
    return Promise.reject(error);
  }
);
// --- END OF NEW CODE ---

export default api;