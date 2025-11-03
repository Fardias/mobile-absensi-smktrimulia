import api from "./index";

export const utilityAPI = {
  listKelas: () => api.get("/utillity/getListKelas"),
};
