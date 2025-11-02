import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
    onClose: () => void;
};

const AbsenDatang = ({ onClose } : Props) => {
  return (
    <View>
      <Text style={styles.modalTitle}>Absen Datang</Text>
      <Text style={styles.modalText}>Ini adalah konten untuk absen datang. Selamat pagi!</Text>
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

export default AbsenDatang;
