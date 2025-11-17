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
  const [distance, setDistance] = useState<number | null>(null);
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

  // Konversi derajat ke radian
  const toRad = (v: number) => (v * Math.PI) / 180;
  // Hitung jarak (meter) antar titik menggunakan Haversine
  const calcDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  useEffect(() => {
    const init = async () => {
      const loc = await getLocation();
      if (loc) {
        setLatitude(loc.latitude);
        setLongitude(loc.longitude);
        if (pengaturan?.latitude && pengaturan?.longitude) {
          const d = calcDistanceMeters(loc.latitude, loc.longitude, pengaturan.latitude, pengaturan.longitude);
          setDistance(d);
        }
      }
      if (pengaturan?.radius_meter != null) {
        setRadius(pengaturan.radius_meter);
      }
    };
    init();
  }, [pengaturan]);

  // Proses absen datang: kirim lokasi dan tampilkan notifikasi sesuai aturan backend
  const handleAbsen = async () => {
    try {
      setLoading(true);
      setMessage(null);
      setError(null);

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

      // hitung ulang jarak
      const dNow =
        pengaturan
          ? calcDistanceMeters(
            loc.latitude,
            loc.longitude,
            pengaturan.latitude,
            pengaturan.longitude
          )
          : null;

      const rNow = pengaturan?.radius_meter ?? null;
      const delta = dNow != null && rNow != null ? Math.max(0, dNow - rNow) : null;

      setDistance(dNow ?? null);
      setRadius(rNow ?? null);

      // siapkan data JSON
      const payload = { latitude: loc.latitude, longitude: loc.longitude };
      // kirim API
      const { data } = await absensiAPI.absen(payload);

      const msg = data?.message || "Berhasil absen datang";
      setMessage(msg);

      const detail =
        dNow != null && rNow != null
          ? `\nJarak: ${dNow} m\nRadius: ${rNow} m\n${dNow <= rNow ? "Dalam radius" : `Di luar radius • Selisih: ${delta} m`
          }`
          : "";

      Alert.alert("Berhasil", `${msg}${detail}`);
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
      const errors = resp?.errors || resp?.responseData || resp?.data || {};
      const reason: string | undefined = errors?.reason;
      const serverDistance = errors?.distance ?? errors?.data?.distance ?? resp?.responseData?.distance;

      let detail = "";
      if (reason === 'outside_radius' || /radius/i.test(String(errMsg)) || typeof serverDistance === 'number') {
        const d = typeof serverDistance === 'number' ? serverDistance : distance ?? null;
        const r = typeof errors?.radius === 'number' ? errors.radius : radius ?? null;
        if (d != null && r != null) {
          const delta = Math.max(0, d - r);
          setError(`${errMsg} • Selisih: ${delta} m`);
          detail = `\nJarak: ${d} m\nRadius: ${r} m\nDi luar radius • Selisih: ${delta} m`;
        } else {
          setError(errMsg);
        }
      } else {
        setError(errMsg);
      }
      Alert.alert("Gagal", `${errMsg}${detail}`);
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
      {distance != null && (
        <Text style={styles.info}>Jarak Anda: {distance} m{radius != null ? ` • ${distance <= radius ? 'Dalam radius' : 'Di luar radius'}` : ''}</Text>
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
