import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import TimeCard from "../../components/TimeCard";
import ActionButton from "@/components/ActionButton";
import RiwayatCard, { RiwayatList } from '@/components/RiwayatCard';

export default function Index() {
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
            <View style={styles.greetings}>
              <Text style={styles.greetingText}>Hai, Fardias Alfathan 👋</Text>
              <Text style={styles.dateText}>{`${dayName}, ${date} ${monthName} ${year}`}</Text>
            </View>
          </LinearGradient>

          {/* Time Cards Section */}
          <View style={styles.timeCardSection}>
            {/* <Text style={styles.sectionTitle}>Jam Masuk dan Keluar Hari Ini</Text> */}
            <View style={styles.timeCardContainer}>
              <TimeCard judul="Jam Datang" jam="06:30" />
              <TimeCard judul="Jam Pulang" jam="15:00" />
            </View>
          </View>

          {/* Action Buttons Section */}
          <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>Menu Absensi</Text>
            <View style={styles.actionButtonContainer}>
              <ActionButton
                iconName="time"
                iconText="Absen Datang"
                type="absenDatang"
              />
              <ActionButton
                iconName="time"
                iconText="Absen Pulang"
                type="absenPulang"
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
          <View style={{paddingHorizontal: 20, marginTop: 20}}>
            <Text style={styles.sectionTitle}>Status Absensi Hari Ini</Text>
            <RiwayatCard hari="Senin" tanggal="01" bulan="Okt" tahun={2025} jamDatang="07:30" jamPulang="16:00" status="Hadir" />
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