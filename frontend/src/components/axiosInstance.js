import axios from 'axios';

export const API_URL = "http://localhost:8000";

const authToken = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
    
    baseURL: API_URL,
    headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
    },
});
console.log(authToken);

export default axiosInstance;
