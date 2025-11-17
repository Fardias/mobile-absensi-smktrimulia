import ActionButton from "@/components/ActionButton";
import RiwayatCard from '@/components/RiwayatCard';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TimeCard from "../../components/TimeCard";
import { useEffect, useMemo, useState } from 'react';
import { generalAPI, Pengaturan } from "../../lib/api/general";
import { useAuth } from "../../contexts/AuthContext";
import { absensiAPI } from "../../lib/api/absensi";
import { RiwayatList } from "../../components/RiwayatCard";

export default function Index() {
  const [pengaturan, setPengaturan] = useState<Pengaturan | null>(null);
  const [loadingPengaturan, setLoadingPengaturan] = useState(false);
  const [errorPengaturan, setErrorPengaturan] = useState<string | null>(null);
  const [riwayatHariIni, setRiwayatHariIni] = useState<any | null>(null);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const { user } = useAuth();
  const riwayatData = [
    {
      hari: 'Senin',
      tanggal: '01',
      bulan: 'Okt',
      tahun: 2025,
      jamDatang: '07:30',
      jamPulang: '16:00',
      status: 'Hadir',
    },
    // ... data lainnya
  ];
  const today = new Date();

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dayName = days[today.getDay()];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthName = months[today.getMonth()];

  const date = today.getDate();
  const year = today.getFullYear();


  useEffect(() => {
    // Muat pengaturan sekolah (lokasi, radius, jam, toleransi)
    const fetchPengaturan = async () => {
      try {
        setLoadingPengaturan(true);
        const { data } = await generalAPI.getPengaturan();
        setPengaturan(data);
      } catch (e: any) {
        setErrorPengaturan(e?.response?.data?.message || 'Gagal memuat pengaturan');
      } finally {
        setLoadingPengaturan(false);
      }
    };
    fetchPengaturan();
  }, []);

  useEffect(() => {
    // Muat status absensi hari ini untuk siswa
    const fetchRiwayatHariIni = async () => {
      try {
        setLoadingRiwayat(true);
        const { data } = await absensiAPI.riwayatAbsenHariIni();
        const payload = (data?.responseData ?? data) || null;
        setRiwayatHariIni(payload);
      } catch (e) {
        setRiwayatHariIni(null);
      } finally {
        setLoadingRiwayat(false);
      }
    };
    fetchRiwayatHariIni();
  }, []);

  const formatJam = (jam?: string) => {
    if (!jam) return '-';
    const parts = jam.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  };

  const jamMasuk = useMemo(() => formatJam(pengaturan?.jam_masuk), [pengaturan]);
  const jamPulang = useMemo(() => formatJam(pengaturan?.jam_pulang), [pengaturan]);
  const toleransiMenit = pengaturan?.toleransi_telat ?? 0;

  const canCheckInWindow = useMemo(() => {
    if (!pengaturan?.jam_masuk) return false;
    const [h, m] = pengaturan.jam_masuk.split(':').map((x) => parseInt(x, 10));
    const start = new Date(today);
    start.setHours(h || 0, m || 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + toleransiMenit);
    const now = today.getTime();
    return now >= start.getTime() && now <= end.getTime();
  }, [pengaturan, today, toleransiMenit]);

  const isWithinCheckOut = useMemo(() => {
    if (!pengaturan?.jam_pulang) return false;
    const [h, m] = pengaturan.jam_pulang.split(':').map((x) => parseInt(x, 10));
    const start = new Date(today);
    start.setHours(h || 0, m || 0, 0, 0);
    return today.getTime() >= start.getTime();
  }, [pengaturan, today]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section with Gradient */}
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            {/* Header: sapaan pengguna (khusus siswa) dan tanggal hari ini */}
            <View style={styles.greetings}>
              <Text style={styles.greetingText}>Hai, {user?.nama || user?.username || 'Pengguna'} 👋</Text>
              <Text style={styles.dateText}>{`${dayName}, ${date} ${monthName} ${year}`}</Text>
            </View>
          </LinearGradient>

          {/* Time Cards: jam datang/pulang dari pengaturan sekolah */}
          <View style={styles.timeCardSection}>
            {/* <Text style={styles.sectionTitle}>Jam Masuk dan Keluar Hari Ini</Text> */}
            <View style={styles.timeCardContainer}>
              <TimeCard judul="Jam Datang" jam={jamMasuk} />
              <TimeCard judul="Jam Pulang" jam={jamPulang} />
            </View>
            {pengaturan && (
              <Text style={styles.toleransiText}>
                Toleransi keterlambatan: {toleransiMenit} menit
              </Text>
            )}
            {errorPengaturan && (
              <Text style={styles.errorText}>{errorPengaturan}</Text>
            )}
          </View>

          {/* Aksi Absensi: Datang, Pulang, dan Izin/Sakit */}
          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>Menu Absensi</Text>
            <View style={styles.actionButtonContainer}>
              <ActionButton
                iconName="time"
                iconText="Absen Datang"
                type="absenDatang"
                disabled={!canCheckInWindow || loadingPengaturan || !pengaturan || !!riwayatHariIni?.jam_datang}
                pengaturan={pengaturan}
              />
              <ActionButton
                iconName="time"
                iconText="Absen Pulang"
                type="absenPulang"
                disabled={!isWithinCheckOut || loadingPengaturan || !pengaturan}
                pengaturan={pengaturan}
              />
              <ActionButton
                iconName="time"
                iconText="Izin/Sakit"
                type="izinSakit"
              />
            </View>
            <View style={styles.actionButtonSingle}>

            </View>
          </View>

          {/* <RiwayatList
            data={riwayatData}
            onSeeAll={() => console.log('Lihat semua')}
            onCardPress={(item) => console.log('Card pressed', item)}
          /> */}
          {/* Status Absensi Hari Ini */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Text style={styles.sectionTitle}>Status Absensi Hari Ini</Text>
            {loadingRiwayat ? (
              <Text style={styles.errorText}>Memuat...</Text>
            ) : riwayatHariIni ? (
              <RiwayatList
                data={[{
                  hari: dayName,
                  tanggal: String(date).padStart(2, '0'),
                  bulan: monthName.slice(0, 3),
                  tahun: year,
                  jamDatang: riwayatHariIni.jam_datang ?? '-',
                  jamPulang: riwayatHariIni.jam_pulang ?? '-',
                  status: (riwayatHariIni.status ?? 'Hadir')
                    .replace(/^hadir$/i, 'Hadir')
                    .replace(/^terlambat$/i, 'Terlambat')
                    .replace(/^izin$/i, 'Izin')
                    .replace(/^sakit$/i, 'Sakit')
                    .replace(/^alfa$/i, 'Alpha')
                }]}
                showHeader={false}
              />
            ) : (
              <Text style={styles.errorText}>Belum ada absensi hari ini</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  greetings: {
    flexDirection: 'column',
    gap: 8,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 14,
    color: '#E8F4F8',
    fontWeight: '500',
  },
  timeCardSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001933',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  timeCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  toleransiText: {
    marginTop: 8,
    color: '#357ABD',
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '600',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  actionButtonSingle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
  