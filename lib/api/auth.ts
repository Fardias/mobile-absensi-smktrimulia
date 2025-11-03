import api from "./index";

export const authAPI = {
  login: (credentials: FormData) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  refresh: () => api.post("/refresh"),
  me: () => api.get("/me"),
};
