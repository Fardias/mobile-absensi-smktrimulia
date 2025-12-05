import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Href } from 'expo-router';
import { Pengaturan } from "../lib/api/general";

type Props = {
  iconName: any;
  iconText: string;
  type?: string;
  onPress?: () => void;
  disabled?: boolean;
  pengaturan?: Pengaturan | null;
}

export default function ActionButton({ iconName, iconText, onPress, type, disabled = false, pengaturan }: Props) {
  const handlePress = () => {
    if (disabled) return;
    onPress?.();
    switch (type) {
      case 'absenDatang':
        router.push('/absen-datang' as Href);
        break;
      case 'absenPulang':
        router.push('/absen-pulang' as Href);
        break;
      case 'izinSakit':
        router.push('/izin-sakit' as Href);
        break;
      default:
        break;
    }
  };

  const getModalContentComponent = () => null;

  const getIconConfig = () => {
    switch (type) {
      case 'absenDatang':
        return { icon: 'log-in-outline', color: '#4CAF50', bgColor: '#E8F5E9' };
      case 'absenPulang':
        return { icon: 'log-out-outline', color: '#FF9800', bgColor: '#FFF3E0' };
      case 'izinSakit':
        return { icon: 'medkit-outline', color: '#F44336', bgColor: '#FFEBEE' };
      default:
        return { icon: iconName, color: '#4A90E2', bgColor: '#E3F2FD' };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <>
      <TouchableOpacity
        style={[styles.card, disabled && styles.cardDisabled]}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={[styles.iconContainer, { backgroundColor: disabled ? '#F2F2F2' : iconConfig.bgColor }]}>
          <Ionicons name={iconConfig.icon} size={28} color={disabled ? '#A0A0A0' : iconConfig.color} />
        </View>
        <Text style={[styles.iconLabel, disabled && styles.iconLabelDisabled]}>{iconText}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flex: 1,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#001933',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardDisabled: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EFEFEF',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#001933',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  iconLabelDisabled: {
    color: '#A0A0A0',
  }
});
