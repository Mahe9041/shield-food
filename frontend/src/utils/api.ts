import axios from "axios";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "https://shield-food-production.up.railway.app/api";

// Create a custom axios instance with our base config
const api = axios.create({
  baseURL: BASE, // Vite proxy will forward this to localhost:3001
});

// Request interceptor — runs before EVERY request we make
api.interceptors.request.use((config) => {
  // Automatically attach the JWT token to every request
  // So we never have to manually add Authorization header
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — runs when EVERY response comes back
api.interceptors.response.use(
  // Success — just return the response as-is
  (response) => response,

  // Error — check if it's a 401 (token expired or invalid)
  (error) => {
    if (error.response?.status === 401) {
      // Clear the invalid token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
