import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Location from 'expo-location';
import { generalAPI, Pengaturan } from '../lib/api/general';
import { absensiAPI } from '../lib/api/absensi';
import { router, Stack } from 'expo-router';

export default function AbsenDatangPage() {
  const [pengaturan, setPengaturan] = useState<Pengaturan | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [errorSettings, setErrorSettings] = useState<string | null>(null);
  const [me, setMe] = useState<{ latitude: number; longitude: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(new Date());
const init = async () => {
      try {
        setLoadingSettings(true);
        const { data } = await generalAPI.getPengaturan();
        setPengaturan(data);
      } catch (e: any) {
        setErrorSettings(e?.response?.data?.message || 'Gagal memuat pengaturan');
      } finally {
        setLoadingSettings(false);
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setMe({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      }
    };
  useEffect(() => {
    
    init();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const region: Region | undefined = useMemo(() => {
    if (!pengaturan) return undefined;
    return {
      latitude: pengaturan.latitude,
      longitude: pengaturan.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
  }, [pengaturan]);

  const isTooLate = useMemo(() => {
    if (!pengaturan?.jam_masuk) return false;
    const jamStr = String(pengaturan.jam_masuk).slice(0, 5);
    const [hh, mm] = jamStr.split(':');
    const tgl = new Date(now);
    const jamMasuk = new Date(tgl.getFullYear(), tgl.getMonth(), tgl.getDate(), Number(hh || 0), Number(mm || 0), 0, 0);
    const toleransi = Number(pengaturan?.toleransi_telat ?? 0);
    const batas = new Date(jamMasuk.getTime() + toleransi * 60000);
    return now.getTime() > batas.getTime();
  }, [pengaturan, now]);

  const onAbsen = async () => {
    try {
      if (!me) {
        Alert.alert('Izin lokasi dibutuhkan', 'Aktifkan GPS dan beri izin lokasi untuk aplikasi.');
        return;
      }
      setSubmitting(true);
      const { data } = await absensiAPI.absen({ latitude: me.latitude, longitude: me.longitude });
      const msg = data?.responseMessage || data?.message || 'Berhasil absen datang';
      Alert.alert('Berhasil', msg);
      router.back();
    } catch (e: any) {
      const status = e?.response?.status;
      const resp = e?.response?.data || {};
      const msg = resp?.responseMessage || resp?.message || (status === 401 ? 'Sesi berakhir, silakan login ulang' : e?.message || 'Gagal absen datang');
      const rd = resp?.errors || resp?.responseData || {};
      const d = typeof rd?.distance === 'number' ? rd.distance : null;
      const r = typeof rd?.radius === 'number' ? rd.radius : null;
      if (d != null && r != null) {
        const delta = Math.max(0, Math.round(d) - r);
        const info = `Posisi kamu saat ini berada di ${Math.round(d)} m. Mendekat sebanyak ${delta} m lagi agar masuk ke radius absensi (${r} m).`;
        Alert.alert('Gagal', `${msg}\n\n${info}`);
      } else {
        Alert.alert('Gagal', msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#001933" />
        </TouchableOpacity>
        <Text style={styles.title}>Absen Datang</Text>
      </View>
      {errorSettings && <Text style={styles.error}>{errorSettings}</Text>}
      <View style={styles.mapBox}>
        {region ? (
          <MapView style={styles.map} initialRegion={region}>
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Sekolah" description="Lokasi sekolah" />
            {me && (
              <Marker coordinate={{ latitude: me.latitude, longitude: me.longitude }} title="Posisi Anda" anchor={{ x: 0.5, y: 1 }}>
                <View style={styles.personMarker}>
                  <Ionicons name="person" size={20} color="#FFFFFF" />
                </View>
              </Marker>
            )}
            {pengaturan && (
              <Circle center={{ latitude: pengaturan.latitude, longitude: pengaturan.longitude }} radius={pengaturan.radius_meter} strokeColor="#4A90E2" fillColor="rgba(74,144,226,0.15)" />
            )}
          </MapView>
        ) : (
          <View style={styles.mapLoading}><ActivityIndicator /></View>
        )}
      </View>

      <View style={styles.infoRow}>
        {pengaturan && <Text style={styles.info}>Batas radius: {pengaturan.radius_meter} m</Text>}
        <Text>Latitude: {me?.latitude}</Text>
        <Text>Longitude: {me?.longitude}</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={init}>
          <Ionicons name="refresh" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>



      <View style={styles.actionsSingle}>
        <TouchableOpacity style={styles.primaryBtnFull} onPress={onAbsen} disabled={submitting || !me || isTooLate}>
          <Text style={styles.primaryBtnText}>{submitting ? 'Memproses...' : 'Absen Datang'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2F7',
  },

  // Typography
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001933',
  },
  subtitle: {
    fontSize: 13,
    color: '#357ABD',
    marginTop: 6,
    fontWeight: '600',
  },
  error: {
    color: '#D32F2F',
    paddingHorizontal: 20,
    marginTop: 6,
    fontWeight: '600',
  },
  info: {
    color: '#357ABD',
    fontWeight: '600',
  },

  // Map
  mapBox: {
    height: 360,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5EAF0',
  },
  map: {
    flex: 1,
  },
  mapLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personMarker: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Info
  infoRow: {
    paddingHorizontal: 20,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  actionsSingle: {
    paddingHorizontal: 20,
    marginTop: 16,
  },

  // Buttons
  primaryBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryBtnFull: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryBtnText: {
    color: '#001933',
    fontWeight: '700',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#357ABD',
  },
});
