import axios from 'axios'

const api = axios.create({
    // baseURL: 'https://financas-app-backend-one.vercel.app'
    // baseURL: import.meta.env.VITE_API_URL || 'https://financas-app-backend-one.vercel.app'
    baseURL: 'http://localhost:3000'
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;