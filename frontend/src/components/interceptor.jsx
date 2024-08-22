import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://13.127.215.10:8000';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {},
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {   
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      toast.error('An error occurred while setting up the request.');
      return Promise.reject(error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default instance;
