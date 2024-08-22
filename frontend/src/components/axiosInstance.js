import axios from 'axios';
import { toast } from 'react-toastify';

export const API_URL = "http://13.127.215.10:8000";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to dynamically set the authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const authToken = localStorage.getItem("accessToken");
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Response interceptor to handle errors and perform actions based on the response
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        
       
        if (status === 401 || data.error_code === 'NO_TOKEN_PROVIDED' || data.error_code === 'INVALID_TOKEN') {
          toast.error('Token expired, returning to login');
          localStorage.clear();
          window.location.replace('/login');
          return Promise.reject(error);
        }
  
        // Handle other specific cases as needed
      } else if (error.request) {
        console.error('No Response Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
  
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;