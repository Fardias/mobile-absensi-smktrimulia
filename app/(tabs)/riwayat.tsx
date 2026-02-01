import { Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useEffect, useState } from "react";
import { absensiAPI } from "../../lib/api/absensi";
import RiwayatCard from "../../components/RiwayatCard";
import { useAuth } from "../../contexts/AuthContext";

export default function Riwayat() {
  // const [data, setData] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const categories = [
    { key: 'semua', label: 'Semua' },
    { key: 'hadir', label: 'Hadir' },
    { key: 'alfa', label: 'Alfa' },
    { key: 'izin', label: 'Izin' },
    { key: 'terlambat', label: 'Terlambat' },
    { key: 'sakit', label: 'Sakit' },
  ];
  const [selected, setSelected] = useState<string>('semua');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const parseServerDate = (str: string | undefined | null): Date | null => {
    if (!str) return null;
    const s = String(str).trim();
    // console.log("riwayat page - s", s);
    const dmY = /^([0-3]\d)-(0\d|1[0-2])-(\d{4})$/; // dd-mm-YYYY
    // console.log("riwayat page - dmY", dmY);
    const iso = /^(\d{4})-(0\d|1[0-2])-[0-3]\d/; // YYYY-MM-DD
    // console.log("riwayat page - iso", iso);
    if (dmY.test(s)) {
      const [, dd, mm, yyyy] = s.match(dmY)!;
      const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      return isNaN(d.getTime()) ? null : d;
    }
    if (iso.test(s)) {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const statusParam = selected === 'semua' ? undefined : selected.toLowerCase();
        const { data } = await absensiAPI.riwayat(statusParam);
        const payload = data?.responseData;
        console.log("riwayat page - payload", payload);

        const list = Array.isArray(payload) ? payload : [];
        // console.log("riwayat page - list", list);

        setFiltered(selected === 'semua' ? list : list.filter((it) => String(it?.status || '').toLowerCase() === selected.toLowerCase()));
        // console.log("riwayat page - filtered", filtered);

      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [selected]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const statusParam = selected === 'semua' ? undefined : selected.toLowerCase();
      const { data } = await absensiAPI.riwayat(statusParam);
      const payload = data?.responseData;
      const list = Array.isArray(payload) ? payload : [];
      console.log("riwayat page - list", list);
      setFiltered(selected === 'semua' ? list : list.filter((it) => String(it?.status || '').toLowerCase() === selected.toLowerCase()));
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
      <Text style={styles.title}>Riwayat Absensi</Text>
      <Text style={styles.filterLabel}>Filter status</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll} contentContainerStyle={styles.hScrollContent}>
        {categories.map((c) => (
          <TouchableOpacity key={c.key} style={[styles.pill, selected === c.key && styles.pillActive]} onPress={() => setSelected(c.key)}>
            <Text style={[styles.pillText, selected === c.key && styles.pillTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ gap: 12, marginTop: 16 }}>
        {filtered.map((item, idx) => {
          const tanggalStr = item?.rencana_absensi?.tanggal;

          const dParsed = parseServerDate(tanggalStr);
          console.log("riwayat page - dParsed", dParsed);

          const d = dParsed ?? new Date(item?.created_at || Date.now());
          const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][d.getDay()];
          const date = String(d.getDate()).padStart(2, '0');
          const bulan3 = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()];
          const tahunNum = d.getFullYear();
          return (
            <RiwayatCard
              key={idx}
              hari={hari}
              tanggal={date}
              bulan={bulan3}
              tahun={tahunNum}
              jamDatang={item?.jam_datang ? String(item.jam_datang).slice(0, 5) : '-'}
              jamPulang={item?.jam_pulang ? String(item.jam_pulang).slice(0, 5) : '-'}
              status={(item?.status ?? 'Hadir')
                .replace(/^hadir$/i, 'Hadir')
                .replace(/^terlambat$/i, 'Terlambat')
                .replace(/^izin$/i, 'Izin')
                .replace(/^sakit$/i, 'Sakit')
                .replace(/^alfa$/i, 'Alfa')}
              keterangan={item?.keterangan || '-'}
            />
          );
        })}
        {filtered.length === 0 && (
          <Text style={styles.empty}>
            {selected === 'semua' ? 'Belum ada riwayat absensi' : `Belum ada riwayat untuk absensi '${categories.find(c => c.key === selected)?.label}'`}
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
