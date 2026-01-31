import api from "./index";

export const authAPI = {
  login: (credentials: { username: string; password: string }) => api.post("/login", credentials),
  logout: () => api.post("/logout"),
  profile: () => api.get("/profil"),
};
