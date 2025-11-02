import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
    onClose: () => void;
};

const AbsenPulang = ({ onClose } : Props) => {
  return (
    <View>
      <Text style={styles.modalTitle}>Absen Pulang</Text>
      <Text style={styles.modalText}>Ini adalah konten untuk absen Pulang. Selamat pagi!</Text>
      <Button title="Tutup" onPress={onClose} />
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
});

export default AbsenPulang;
