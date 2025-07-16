import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, //do this for cross site oirign
});

// axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
// (axiosInstance.defaults.headers = { "x-platform": "web" }),
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    }
  );

export default axiosInstance;
