import api from "./index";

export const absensiAPI = {
  absen: (data: any) => api.post("/absensi", data),
  absenPulang: (data: any) => api.post("/absensi/pulang", data),
  izinSakit: (data: any) => api.post("/absensi/izinsakit", data),
  riwayat: (status?: string) => api.get("/absensi/riwayat", { params: status ? { status } : undefined }),
  riwayatAbsenHariIni: () => api.get("/absensi/hariini"),
  profil: () => api.get("/profil"),
};
