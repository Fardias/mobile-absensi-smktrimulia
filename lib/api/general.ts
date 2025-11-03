import api from "./index";

export const generalAPI = {
  totalSiswa: () => api.get("/total-siswa"),
  siswaHadirHariIni: () => api.get("/hadir-hariini"),
  siswaTerlambatHariIni: () => api.get("/terlambat-hariini"),
  siswaIzinHariIni: () => api.get("/izinsakit-hariini"),
};
