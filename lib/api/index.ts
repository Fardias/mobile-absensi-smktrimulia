import axios from "axios";
import { storage } from "../storage";

// const API_BASE_URL = "https://kamron-problockade-indiscriminatingly.ngrok-free.dev/api";
const API_BASE_URL = "https://api-trimulia.aftlah.my.id/api";
// const API_BASE_URL = "http://10.0.2.2:8000/api";


// Klien HTTP: baseURL (ngrok saat pengembangan) dan header default
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Sisipkan token Bearer jika tersedia; hapus header saat FormData
api.interceptors.request.use(
  async (config) => {
    const token = await storage.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Jika 401, bersihkan storage; redirect dilakukan oleh AuthContext
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
