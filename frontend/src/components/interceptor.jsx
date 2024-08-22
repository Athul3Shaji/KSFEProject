import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8000';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {},
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle token expiration or invalid token
      if (status === 403) {
        toast.error('Token expired, returning to login');
        localStorage.clear();
        window.location.replace('/login');
      } else if (data.error_code === 'NO_TOKEN_PROVIDED' || data.error_code === 'INVALID_TOKEN') {
        toast.error('Token expired, returning to login');
        localStorage.clear();
        window.location.replace('/login');
      }
    } else if (error.request) {
      // Handle request errors
    } else {
      // Handle other errors
    }

    return Promise.reject(error);
  }
);

export default instance;
