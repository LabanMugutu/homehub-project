import axios from 'axios';

// 1. Create the instance
const api = axios.create({
  baseURL: 'https://homehub-backend-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. Request Interceptor (Attaches Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. 🟢 RESPONSE INTERCEPTOR (The "Perfect" Addition)
// This catches 401 errors (expired tokens) globally
api.interceptors.response.use(
  (response) => response, // Return successful responses as is
  (error) => {
    // If the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.warn('Session expired. Logging out...');
      
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Force redirect to login page
      // We use window.location because we can't use useNavigate inside a JS file
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;