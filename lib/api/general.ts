import api from "./index";

export const generalAPI = {
  getPengaturan: () => api.get("/pengaturan"),
};

export type Pengaturan = {
  latitude: number;
  longitude: number;
  radius_meter: number;
  jam_masuk: string; // HH:MM:SS atau HH:MM
  jam_pulang: string; // HH:MM:SS atau HH:MM
  toleransi_telat: number;
};
