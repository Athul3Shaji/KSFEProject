import axios from "axios";
const BASE_URL = "http://localhost:8000";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {},
});

// Request Interceptor
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accesstoken");
  
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response && error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const accessToken = await refreshAccessToken();
        axiosPrivate.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.replace("/login");
      }
    }

    // Handle specific errors, such as user denial
    if (error.response?.data === "User Denied") {
      localStorage.clear();
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

// Function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const data = { refreshTokenSign: refreshToken };

  try {
    const response = await axios.post(`${BASE_URL}/users/refreshAccessToken`, data);
    const newAccessToken = response.data?.accessToken;

    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    } else {
      throw new Error("Failed to refresh access token");
    }
  } catch (err) {
    localStorage.clear();
    window.location.replace("/login");
    return Promise.reject(err);
  }
};

export const axiosPrivate = instance;
