import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { absensiAPI } from "../../lib/api/absensi";
import RiwayatCard from "../../components/RiwayatCard";
import { useAuth } from "../../contexts/AuthContext";

export default function Riwayat() {
  const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const categories = [
    { key: 'semua', label: 'Semua' },
    { key: 'hadir', label: 'Hadir' },
    { key: 'alfa', label: 'Alpha' },
    { key: 'izin', label: 'Izin' },
    { key: 'terlambat', label: 'Terlambat' },
    { key: 'sakit', label: 'Sakit' },
  ];
  const [selected, setSelected] = useState<string>('semua');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await absensiAPI.riwayat(selected === 'semua' ? undefined : selected);
        const payload = data?.responseData ?? data;
        const list = Array.isArray(payload) ? payload : [];
        setData(list);
        setFiltered(list);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selected]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const { data } = await absensiAPI.riwayat(selected === 'semua' ? undefined : selected);
      const payload = data?.responseData ?? data;
      const list = Array.isArray(payload) ? payload : [];
      setData(list);
      setFiltered(list);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll} contentContainerStyle={styles.hScrollContent}>
        {categories.map((c) => (
          <TouchableOpacity key={c.key} style={[styles.pill, selected===c.key && styles.pillActive]} onPress={()=>setSelected(c.key)}>
            <Text style={[styles.pillText, selected===c.key && styles.pillTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ gap: 12, marginTop: 16 }}>
        {filtered.map((item, idx) => {
          const tanggalStr = item?.rencanaAbsensi?.tanggal || item?.tanggal || "";
          const d = tanggalStr ? new Date(tanggalStr) : new Date();
          const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()];
          const date = String(d.getDate()).padStart(2, '0');
          const bulan3 = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()];
          const tahunNum = d.getFullYear();
          return (
            <RiwayatCard
              key={idx}
              hari={hari}
              tanggal={date}
              bulan={bulan3}
              tahun={tahunNum}
              jamDatang={item?.jam_datang ? String(item.jam_datang).slice(0,5) : '-'}
              jamPulang={item?.jam_pulang ? String(item.jam_pulang).slice(0,5) : '-'}
              status={(item?.status ?? 'Hadir')
                .replace(/^hadir$/i, 'Hadir')
                .replace(/^terlambat$/i, 'Terlambat')
                .replace(/^izin$/i, 'Izin')
                .replace(/^sakit$/i, 'Sakit')
                .replace(/^alfa$/i, 'Alpha')}
            />
          );
        })}
        {filtered.length === 0 && (
          <Text style={styles.empty}>
            {selected === 'semua' ? 'Belum ada riwayat absensi' : `Belum ada riwayat untuk absensi '${categories.find(c=>c.key===selected)?.label}'`}
          </Text>
        )}
      </View>
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
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#001933',
  },
  hScroll: {
    backgroundColor: '#F7F9FC',
    borderRadius: 8,
  },
  hScrollContent: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pillActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#4A90E2',
  },
  pillText: {
    color: '#001933',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#4A90E2',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 12,
  },
});