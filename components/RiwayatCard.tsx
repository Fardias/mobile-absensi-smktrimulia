import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type RiwayatCardProps = {
  hari: string;
  tanggal: string;
  bulan: string;
  tahun: number;
  jamDatang: string;
  jamPulang: string;
  status?: string;
  onPress?: () => void;
};

const RiwayatCard = ({
  hari,
  tanggal,
  bulan,
  tahun,
  jamDatang,
  jamPulang,
  status,
  onPress,
}: RiwayatCardProps) => {
  type IoniconName =
    | "checkmark-circle"
    | "information-circle"
    | "medkit"
    | "close-circle";

  const getStatusConfig = (): {
    icon: IoniconName;
    color: string;
    bgColor: string;
  } => {
    switch (status) {
      case "Hadir":
        return {
          icon: "checkmark-circle",
          color: "#4CAF50",
          bgColor: "#E8F5E9",
        };
      case "Izin":
        return {
          icon: "information-circle",
          color: "#FF9800",
          bgColor: "#FFF3E0",
        };
      case "Sakit":
        return { icon: "medkit", color: "#F44336", bgColor: "#FFEBEE" };
      case "Alpha":
        return { icon: "close-circle", color: "#9E9E9E", bgColor: "#F5F5F5" };
      default:
        return {
          icon: "checkmark-circle",
          color: "#4A90E2",
          bgColor: "#E3F2FD",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={styles.card}>
      {/* Date Section */}
      <View style={styles.dateSection}>
        <View style={styles.dateBox}>
          <Text style={styles.dateNumber}>{tanggal}</Text>
          <Text style={styles.dateMonth}>{bulan}</Text>
        </View>
        <View style={styles.dateInfo}>
          <Text style={styles.dayName}>{hari}</Text>
          <Text style={styles.yearText}>{tahun}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Time Section */}
      <View style={styles.timeSection}>
        <View style={styles.timeItem}>
          <Ionicons name="log-in-outline" size={18} color="#4A90E2" />
          <View style={styles.timeText}>
            <Text style={styles.timeLabel}>Datang</Text>
            <Text style={styles.timeValue}>{jamDatang}</Text>
          </View>
        </View>

        <View style={styles.timeItem}>
          <Ionicons name="log-out-outline" size={18} color="#FF9800" />
          <View style={styles.timeText}>
            <Text style={styles.timeLabel}>Pulang</Text>
            <Text style={styles.timeValue}>{jamPulang}</Text>
          </View>
        </View>
      </View>

      {/* Status Badge */}
      <View
        style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}
      >
        <Ionicons
          name={statusConfig.icon}
          size={16}
          color={statusConfig.color}
        />
        <Text style={[styles.statusText, { color: statusConfig.color }]}>
          {status}
        </Text>
      </View>

      {/* Arrow Icon */}
      {/* <View style={styles.arrowIcon}>
        <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
      </View> */}
    </View>
  );
};

// Component untuk List Riwayat dengan tombol Lihat Semua
type RiwayatListProps = {
  data: RiwayatCardProps[];
  onSeeAll?: () => void;
  onCardPress?: (item: RiwayatCardProps) => void;
  showHeader?: boolean;
};

export const RiwayatList = ({
  data,
  onSeeAll,
  onCardPress,
  showHeader = true,
}: RiwayatListProps) => {
  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Status Absensi Hari Ini</Text>
          {onSeeAll && (
            <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Lihat semua riwayat</Text>
              <Ionicons name="arrow-forward" size={16} color="#4A90E2" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.cardList}>
        {data.map((item, index) => (
          <RiwayatCard
            key={index}
            {...item}
            // onPress={() => onCardPress?.(item)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#001933",
    letterSpacing: 0.3,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
    letterSpacing: 0.2,
  },
  cardList: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#001933",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    position: "relative",
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateBox: {
    width: 60,
    height: 60,
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4A90E2",
    lineHeight: 28,
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4A90E2",
    textTransform: "uppercase",
  },
  dateInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#001933",
    marginBottom: 2,
  },
  yearText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666666",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 16,
  },
  timeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  timeText: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#001933",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  arrowIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
  },
});

export default RiwayatCard;
