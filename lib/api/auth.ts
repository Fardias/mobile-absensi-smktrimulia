import api from "./index";

export const authAPI = {
  login: (credentials: { username: string; password: string }) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  refresh: () => api.post("/refresh"),
  me: () => api.get("/me"),
};
