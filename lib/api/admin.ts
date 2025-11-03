import api from "./index";

export const adminAPI = {
  rekap: () => api.get("/admin/rekap"),
};
