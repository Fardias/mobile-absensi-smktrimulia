import axios from "axios";
import { storage } from "../storage";

// const API_BASE_URL = "http://192.168.1.8:8000/api"; 
const API_BASE_URL = "http://10.0.2.2:8000/api";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await storage.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove("token");
      storage.remove("user");
    }
    return Promise.reject(error);
  }
);

export default api;
