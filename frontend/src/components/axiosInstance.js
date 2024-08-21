import axios from 'axios';

export const API_URL = "http://localhost:8000";

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

export default axiosInstance;
