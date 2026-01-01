import { Text, View, StyleSheet, Button, ScrollView, RefreshControl, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { absensiAPI } from "../../lib/api/absensi";
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification/lib/commonjs';

export default function Profile() {
  const { logout, user } = useAuth();
  const [profil, setProfil] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await absensiAPI.getDetailProfil();
        const payload = data?.responseData ?? data;
        console.log('Profil:', payload);

        setProfil(payload || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);


 
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const { data } = await absensiAPI.getDetailProfil();
      const payload = data?.responseData ?? data;
      setProfil(payload || null);
    } catch (e: any) {
      const resp = e?.response?.data || {};
      const errMsg = resp?.responseMessage || resp?.message || e?.message || 'Gagal memuat profil';
      setError(errMsg);
    } finally {
      setRefreshing(false);
    }
  };

  const nama = (profil as any)?.nama ?? user?.nama ?? user?.username ?? '-';
  const nis = (profil as any)?.nis ?? '-';
  const jenkel = (profil as any)?.jenis_kelamin === 'L' ? 'Laki-laki' : (profil as any)?.jenis_kelamin === 'P' ? 'Perempuan' : '-';
  const kelas = (profil as any)?.kelas ?? '-';
  const walas = (profil as any)?.wali_kelas ?? '-';



  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.title}>Profil Siswa</Text>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <View style={styles.card}>
        <Text style={styles.label}>Nama</Text>
        <Text style={styles.value}>{nama}</Text>

        <Text style={styles.label}>NIS</Text>
        <Text style={styles.value}>{nis}</Text>

        <Text style={styles.label}>Jenis Kelamin</Text>
        <Text style={styles.value}>{jenkel}</Text>

        <Text style={styles.label}>Kelas</Text>
        <Text style={styles.value}>{kelas}</Text>

        <Text style={styles.label}>Wali Kelas</Text>
        <Text style={styles.value}>{walas}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Reset kata sandi hanya dapat dilakukan melalui kesiswaan.
          Silakan hubungi kesiswaan jika Anda membutuhkan bantuan.
        </Text>
      </View>

      <Button title={loading ? "Memuat..." : "Logout"} onPress={async () => {
        try {
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Konfirmasi Logout',
            textBody: 'Anda yakin ingin keluar dari aplikasi?',
            autoClose: false,
            button: 'Ya, keluar',
            onPressButton: async () => {
              Dialog.hide();
              await logout();
            },
          });
        } catch (e) {
          Alert.alert('Konfirmasi Logout', 'Anda yakin ingin keluar dari aplikasi?', [
            { text: 'Batal', style: 'cancel' },
            { text: 'Ya, keluar', onPress: () => logout() },
          ]);
        }
      }} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001933',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#001933',
    fontWeight: '700',
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    color: '#357ABD',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
});