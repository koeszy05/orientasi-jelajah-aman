// components/WeatherCard.tsx

import { Text, View } from "react-native";
import { WeatherCardProps } from "../types/cuaca";
// 1. Tambahkan baris import ini untuk memanggil variabel dari styles.ts
import { spacing, typeScale } from "../constants/styles";

export default function WeatherCard({
  kota,
  suhu,
  tingkatAQI,
}: WeatherCardProps) {
  const warnaAQI = tingkatAQI === "BAIK" ? "green" : "orange";

  return (
    <View
      style={{
        padding: spacing.sedang, // 2. Ubah angka 16 jadi spacing.sedang
        borderRadius: 8,
        backgroundColor: "#F4F7FA",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: typeScale.judul, // 3. Ubah angka 18 jadi typeScale.judul
        }}
      >
        {kota}
      </Text>

      <Text
        style={{
          fontSize: 32,
        }}
      >
        {suhu}°C
      </Text>

      <Text
        style={{
          color: warnaAQI,
          fontSize: typeScale.isi, // Tambahan font size untuk teks biasa
        }}
      >
        AQI: {tingkatAQI}
      </Text>
    </View>
  );
}