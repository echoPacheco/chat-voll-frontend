import axios from 'axios';
import { getTokenFromCookies } from '@/helpers/auth'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = getTokenFromCookies()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
