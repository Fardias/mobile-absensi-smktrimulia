import { Text, View, StyleSheet, Button, ScrollView, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { absensiAPI } from "../../lib/api/absensi";

export default function Profile() {
  const { logout, user } = useAuth();
  const [profil, setProfil] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        setLoading(true);
        const { data } = await absensiAPI.profil();
        const payload = data?.responseData ?? data;
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
      const { data } = await absensiAPI.profil();
      const payload = data?.responseData ?? data;
      setProfil(payload || null);
    } finally {
      setRefreshing(false);
    }
  };

  const nama = (profil?.nama ?? (user as any)?.siswa?.nama ?? user?.username) || '-';
  const nis = (profil?.nis ?? (user as any)?.siswa?.nis) || '-';
  const jenkelRaw = (profil?.jenkel ?? (user as any)?.siswa?.jenkel) || undefined;
  const jenkel = jenkelRaw === 'L' ? 'Laki-laki' : jenkelRaw === 'P' ? 'Perempuan' : '-';
  const kelasObj = profil?.kelas ?? (user as any)?.siswa?.kelas;
  const kelas = kelasObj ? `${kelasObj.tingkat} ${kelasObj.jurusan?.nama_jurusan ?? ''} ${kelasObj.paralel}`.trim() : '-';
  const walas = (profil?.walas?.nama ?? (kelasObj as any)?.walas?.nama) || '-';

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
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
          Reset kata sandi hanya dapat dilakukan melalui guru piket.
          Silakan hubungi guru piket jika Anda membutuhkan bantuan.
        </Text>
      </View>

      <Button title={loading ? "Memuat..." : "Logout"} onPress={logout} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
});