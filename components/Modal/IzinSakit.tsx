import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native';
import UploadFile from '../UploadFile';
import * as DocumentPicker from 'expo-document-picker';
import { absensiAPI } from '../../lib/api/absensi';
type Props = {
  onClose: () => void;
};

const IzinSakit = ({ onClose }: Props) => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [text, onChangeText] = useState('');
  const [jenis, setJenis] = useState<'izin' | 'sakit'>('izin');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Di iOS, picker tetap terbuka, di Android ditutup
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
  };

  // konek ke api
  const submitIzinSakit = async () => {
    console.log('date', date.toISOString());
    console.log('text', text);
    console.log('jenis', jenis);
    console.log('file', file);

    try {
      if (!text.trim()) {
        Alert.alert('Validasi', 'Keterangan wajib diisi');
        return;
      }
      setSubmitting(true);
      const tanggalStr = new Date(date).toISOString().split('T')[0];

      let res;
      if (file) {
        const formData = new FormData();
        formData.append('tanggal', tanggalStr);
        formData.append('keterangan', text || '');
        formData.append('jenis_absen', jenis);
        const rnFile = {
          uri: file.uri,
          type: file.mimeType ?? 'image/jpeg',
          name: file.name ?? 'upload.jpg',
        } as any;
        formData.append('bukti', rnFile);

        res = await absensiAPI.izinSakit(formData);
      } else {
        res = await absensiAPI.izinSakit({ tanggal: tanggalStr, keterangan: text || '', jenis_absen: jenis });
      }
      Alert.alert('Sukses', res?.data?.responseMessage || 'Izin/Sakit berhasil diajukan');
      onClose();
    } catch (e: any) {
      const status = e?.response?.status;
      const resp = e?.response?.data || {};
      console.log("e", e);
      console.log('izinSakit errorss', status, resp);
      const msg = resp?.responseMessage || resp?.message || (status === 401 ? 'Sesi berakhir, silakan login lagi' : e?.message || 'Terjadi kesalahan saat mengajukan izin/sakit');
      Alert.alert('Gagal', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View >
      {/* <Text style={styles.modalTitle}>Izin Sakit</Text> */}
      <View style={styles.segmentRow}>
        <TouchableOpacity
          onPress={() => setJenis('izin')}
          style={[styles.segmentBtn, jenis === 'izin' ? styles.segmentActive : styles.segmentInactive]}
        >
          <Text style={[styles.segmentText, jenis === 'izin' ? styles.segmentTextActive : styles.segmentTextInactive]}>Izin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setJenis('sakit')}
          style={[styles.segmentBtn, jenis === 'sakit' ? styles.segmentActive : styles.segmentInactive]}
        >
          <Text style={[styles.segmentText, jenis === 'sakit' ? styles.segmentTextActive : styles.segmentTextInactive]}>Sakit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.dateRow}>
          <View style={styles.dateBox}>
            <Text style={styles.dateLabel}>Tanggal</Text>
            <Text style={styles.dateValue}>{date.toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={showMode}>
            <Text style={styles.primaryBtnText}>Pilih Tanggal</Text>
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <View>
        <Text style={styles.inputLabel}>Keterangan</Text>
        <TextInput
          style={styles.textArea}
          onChangeText={onChangeText}
          value={text}
          placeholder="Masukkan keterangan"
          keyboardType="default"
          multiline
        />
      </View>

      <Text style={styles.inputLabel}>Upload Bukti</Text>

      <View>
        <UploadFile onSelect={setFile} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={submitIzinSakit} disabled={submitting}>
          <Text style={styles.primaryBtnText}>{submitting ? 'Mengirim...' : 'Kirim'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#001933',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  segmentActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  segmentInactive: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  segmentTextInactive: {
    color: '#001933',
  },
  card: {
    // backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateBox: {
    flexDirection: 'column',
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 16,
    color: '#001933',
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    padding: 12,
    // minHeight: 80,
    color: '#001933',
    marginBottom: 12,
  },
  actions: {
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    gap: 12,
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  primaryBtnText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    color: '#001933',
    fontWeight: '700',
  },
});

export default IzinSakit;
