import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { absensiAPI } from '../../lib/api/absensi';
import { Pengaturan } from "../../lib/api/general";
import * as Location from 'expo-location';

type Props = {
  onClose: () => void;
  pengaturan?: Pengaturan;
};

const AbsenDatang = ({ onClose, pengaturan }: Props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [serverDistance, setServerDistance] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(null);

  // Ambil lokasi perangkat (foreground) menggunakan expo-location
  const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  };



  useEffect(() => {
    const init = async () => {
      const loc = await getLocation();
      if (loc) {
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
      }
      if (pengaturan?.radius_meter != null) {
        setRadius(pengaturan.radius_meter);
      }
      setServerDistance(null);
    };
    init();
  }, [pengaturan]);

  // Proses absen datang: kirim lokasi dan tampilkan notifikasi sesuai aturan backend
  const handleAbsen = async () => {
    try {
      setLoading(true);
      setMessage(null);
      setError(null);
      setServerDistance(null);

      const loc = await getLocation();
      if (!loc) {
        setError("Gagal mendapatkan lokasi.");
        Alert.alert(
          "Izin Lokasi Dibutuhkan",
          "Lokasi tidak dapat diakses. Nyalakan GPS dan beri izin lokasi untuk aplikasi.",
          [
            { text: "Tutup", style: "cancel" },
            { text: "Buka Pengaturan", onPress: () => (Linking as any).openSettings?.() }
          ]
        );
        return;
      }

      // siapkan data JSON
      const payload = { latitude: loc.latitude, longitude: loc.longitude };
      // kirim API
      const { data } = await absensiAPI.absen(payload);

      const msg = data?.responseMessage || data?.message || "Berhasil absen datang";
      setMessage(msg);
      Alert.alert("Berhasil", msg);
    } catch (e: any) {
      const status = e?.response?.status;
      const resp = e?.response?.data || {};
      const errMsg = resp?.responseMessage || resp?.message || (status === 401
        ? 'Sesi berakhir, silakan login ulang'
        : status === 403
          ? 'Akses ditolak'
          : status === 422
            ? 'Validasi gagal'
            : (e?.message || 'Gagal absen datang'));
      const rd = resp?.responseData || {};
      const d = typeof rd?.distance === 'number' ? rd.distance : null;
      setServerDistance(d);
      if (d != null && radius != null) {
        const delta = Math.max(0, d - radius);
        setError(`${errMsg} • Selisih: ${delta} m`);
        Alert.alert("Gagal", `${errMsg}\nJarak: ${d} m\nRadius: ${radius} m\nSelisih: ${delta} m`);
      } else {
        setError(errMsg);
        Alert.alert("Gagal", errMsg);
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <View>
      <Text style={styles.modalTitle}>Absen Datang</Text>
      <Text style={styles.modalText}>Pastikan berada dalam radius lokasi sekolah.</Text>
      {radius != null && (
        <Text style={styles.info}>Batas radius: {radius} m</Text>
      )}
      {serverDistance != null && (
        <Text style={styles.info}>Jarak (server): {serverDistance} m</Text>
      )}
      {loading && <ActivityIndicator />}
      {message && <Text style={styles.success}>{message}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <Button title={loading ? 'Memproses...' : 'Absen Datang'} onPress={handleAbsen} disabled={loading} />
        <Button title="Tutup" onPress={onClose} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
  },
  info: {
    color: '#357ABD',
    marginBottom: 6,
    fontWeight: '600',
  },
  success: {
    color: '#2E7D32',
    marginBottom: 8,
    fontWeight: '600',
  },
  error: {
    color: '#D32F2F',
    marginBottom: 8,
    fontWeight: '600',
  }
});

export default AbsenDatang;
