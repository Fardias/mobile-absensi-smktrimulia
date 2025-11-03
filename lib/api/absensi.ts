import api from "./index";

export const absensiAPI = {
  absen: (data: FormData) => api.post("/absensi", data),
  absenPulang: (data: FormData) => api.post("/absensi/pulang", data),
  izinSakit: (data: FormData) => api.post("/absensi/izinsakit", data),
  riwayat: () => api.get("/absensi/riwayat"),
  riwayatAbsenHariIni: () => api.get("/absensi/hariini"),
};
