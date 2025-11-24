import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
  judul: string;
  jam: string;
};

const TimeCard = ({ judul, jam }: Props) => {
  const isJamDatang = judul.toLowerCase().includes('datang');

  return (
    <View style={styles.card}>
      {/* <View style={styles.iconContainer}>
        <Ionicons 
          name={isJamDatang ? 'time-outline' : 'timer-outline'} 
          size={24} 
          color="#4A90E2" 
        />
      </View> */}
      <Text style={styles.cardTitle}>{judul}</Text>

      <View style={styles.textContainer}>
        <Text style={styles.cardTime}>{jam} WIB</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#001933',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    // borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  cardTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#001933',
    letterSpacing: 0.5,
  },
});

export default TimeCard;