// src/components/WeatherCard.tsx
import { View, Text, StyleSheet } from "react-native";
import { TingkatAQI } from "../types/cuaca";
import { typeScale, spacing } from "../constants/styles";

interface PropsTambahan {
  kota: string;
  suhu: number;
  tingkatAQI: TingkatAQI;
  indeksAQI?: number;
  suhuMaks?: number;
  suhuMin?: number;
  kondisi?: string;
  kecepatanAngin?: number;
  pm25?: number;
  pm10?: number;
}

const warnaPerTingkat: Record<TingkatAQI, string> = {
  BAIK: "#16a34a",
  SEDANG: "#ca8a04",
  TIDAK_SEHAT: "#ea580c",
  BERBAHAYA: "#dc2626",
};

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
  indeksAQI,
  suhuMaks,
  suhuMin,
  kondisi,
  kecepatanAngin,
  pm25,
  pm10,
}: PropsTambahan) {
  const labelKategori =
    tingkatAQI === "BAIK"
      ? "Baik"
      : tingkatAQI === "SEDANG"
      ? "Sedang"
      : tingkatAQI === "TIDAK_SEHAT"
      ? "Tidak Sehat"
      : "Berbahaya";

  const teksAQI =
    indeksAQI !== undefined ? `AQI: ${indeksAQI} (${labelKategori})` : `AQI: ${labelKategori}`;

  return (
    <View style={styles.card}>
      {/* 1. Bagian Utama: Nama Kota, Suhu & AQI */}
      <View style={styles.mainSection}>
        <Text style={styles.kota}>{kota}</Text>
        <Text style={styles.suhu}>{suhu}°C</Text>
        <Text style={[styles.aqi, { color: warnaPerTingkat[tingkatAQI] || "#16a34a" }]}>
          {teksAQI}
        </Text>
      </View>

      {/* 2. Strip Suhu Maks / Min */}
      {(suhuMaks !== undefined || suhuMin !== undefined) && (
        <View style={styles.subRow}>
          <Text style={styles.subText}>
            Suhu Hari Ini — Maks: {suhuMaks ?? "-"}°C • Min: {suhuMin ?? "-"}°C
          </Text>
        </View>
      )}

      {/* 3. Strip Kondisi Cuaca & Angin */}
      {(kondisi !== undefined || kecepatanAngin !== undefined) && (
        <View style={styles.subRow}>
          <Text style={styles.subText}>
            Kondisi: {kondisi || "Cerah"} • Angin: {kecepatanAngin ?? "-"} km/j
          </Text>
        </View>
      )}

      {/* 4. Strip Partikulat PM2.5 & PM10 */}
      {(pm25 !== undefined || pm10 !== undefined) && (
        <View style={styles.partikulatRow}>
          <Text style={styles.partikulatText}>
            PM2.5: {pm25 ?? "-"} µg/m³ • PM10: {pm10 ?? "-"} µg/m³
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  mainSection: {
    padding: 16,
  },
  kota: {
    fontWeight: "700",
    fontSize: 20,
    color: "#0f172a",
  },
  suhu: {
    fontSize: 32,
    fontWeight: "600",
    color: "#0f172a",
    marginVertical: 4,
  },
  aqi: {
    fontSize: 13,
    fontWeight: "600",
  },
  subRow: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  subText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  partikulatRow: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  partikulatText: {
    fontSize: 11,
    color: "#64748b",
  },
});