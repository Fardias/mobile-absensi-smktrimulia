import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { absensiAPI } from '../../lib/api/absensi';

type Props = {
    onClose: () => void;
};

const AbsenDatang = ({ onClose } : Props) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
    return new Promise((resolve) => {
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        resolve(null);
      }
    });
  };

  const handleAbsen = async () => {
    try {
      setLoading(true);
      setMessage(null);
      setError(null);
      const loc = await getLocation();
      const form = new FormData();
      form.append('latitude', String(loc?.latitude ?? 0));
      form.append('longitude', String(loc?.longitude ?? 0));
      const { data } = await absensiAPI.absen(form);
      setMessage(data?.message || 'Berhasil absen datang');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal absen datang');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={styles.modalTitle}>Absen Datang</Text>
      <Text style={styles.modalText}>Pastikan berada dalam radius lokasi sekolah.</Text>
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
