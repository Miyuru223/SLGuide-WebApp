import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
const API = axios.create({ baseURL: API_URL });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('slguide_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';
  return `${BASE_URL}${path}`;
};

export default API;
