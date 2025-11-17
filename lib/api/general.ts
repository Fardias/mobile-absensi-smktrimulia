import api from "./index";

export const generalAPI = {
  async getPengaturan() {
    const res = await api.get("/pengaturan");
    const payload = res?.data?.responseData ?? res?.data;
    return { data: payload } as { data: Pengaturan };
  },
};

export type Pengaturan = {
  latitude: number;
  longitude: number;
  radius_meter: number;
  jam_masuk: string; // HH:MM:SS atau HH:MM
  jam_pulang: string; // HH:MM:SS atau HH:MM
  toleransi_telat: number;
};
