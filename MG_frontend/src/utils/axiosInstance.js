import axios from "axios";

// Prefer environment-provided API URL; fall back to local dev
// const apiBaseUrl = (import.meta?.env?.VITE_API_URL).replace(/\/$/, "");
const apiBaseUrl = "https://mg-backend-dvl9.onrender.com";
// dep push

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 60000,
  // Do not send cookies by default; opt-in per request (e.g., login)
  withCredentials: false,
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

    // Debug log request URL in the browser
    try {
      if (typeof window !== "undefined") {
        const path = config.url || "";
        const fullUrl = `${apiBaseUrl}${
          path.startsWith("/") ? path : "/" + path
        }`;
        console.log(
          "API request →",
          (config.method || "get").toUpperCase(),
          fullUrl
        );
      }
    } catch {
      // ignore
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface useful debugging info in dev tools
    if (error?.response) {
      console.error("API error:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error?.request) {
      console.error("API network error (no response):", {
        url: error.config?.url,
        request: error.request,
      });
    } else {
      console.error("API setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Expose helpers for quick manual checks in DevTools
try {
  if (typeof window !== "undefined") {
    window.API_BASE = apiBaseUrl;
    window.__apiPing = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/hello");
        console.log("Ping OK:", res.data);
        return res.data;
      } catch (e) {
        console.error("Ping failed:", e);
        throw e;
      }
    };
  }
} catch {
  // ignore
}

export default axiosInstance;
