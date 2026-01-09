import axios from 'axios';

// This is your live backend URL
const api = axios.create({
  baseURL: 'https://homehub-backend-1.onrender.com/api', // Note the /api at the end
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically add the token to every request if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;