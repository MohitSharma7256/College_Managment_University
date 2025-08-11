import axios from "axios";
import { baseApiURL } from "../baseUrl";

// Axios instance with base configuration
const axiosWrapper = axios.create({
  baseURL: baseApiURL(),
});

// Response interceptor for handling common errors
axiosWrapper.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (
      error.response?.data?.message === "Invalid or expired token" &&
      error.response?.data?.success === false &&
      error.response?.data?.data === null
    ) {
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosWrapper;
