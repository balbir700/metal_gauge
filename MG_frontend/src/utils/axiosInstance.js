import axios from "axios";

// Prefer environment-provided API URL; fall back to local dev
const apiBaseUrl = "https://mg-backend-dvl9.onrender.com".replace(/\/$/, "");

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  withCredentials: true, // Enable cookies
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Don't set Content-Type for FormData - let axios handle it
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
