import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 20000,
});

// FormData uploads ke liye browser ko khud Content-Type (with boundary) set karne do,
// isliye yahan koi default Content-Type nahi lagaya gaya.
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// Backend ka message direct throw karo taake UI mein sahi error dikhe
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
