import api from "./index";
import type { AxiosProgressEvent } from "axios";

export const guruAPI = {
  laporan: () => api.get("/guru/laporan"),

  importSiswa: (formData: FormData, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) =>
    api.post("/import-siswa", formData, { onUploadProgress }),

  aktifitasTerbaru: () => api.get("/aktivitas-terbaru"),
  getSiswaIzinSakit: () => api.get("/absensi/siswaIzinSakit"),
  updateAbsensiStatus: (data: FormData) => api.post("/absensi/updateStatus", data),
  lihatAbsensiSiswa: (params?: Record<string, any>) => api.get("/absensi/lihat", { params }),
  lihatAbsensiHariIni: () => api.get("/absensi/hari-ini"),
};
