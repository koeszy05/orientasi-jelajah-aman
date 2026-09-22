// src/app/(tabs)/tentang.tsx

import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Mengambil variabel dari styles.ts untuk hierarki visual
import { spacing, typeScale } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: spacing.sedang, // Menerapkan spacing
        gap: spacing.kecil,
      }}
    >
      <Text
        accessible
        accessibilityLabel="Judul Aplikasi Jelajah Aman" // Menerapkan accessibilityLabel
        style={{
          fontSize: typeScale.judul, // Menerapkan typeScale untuk judul
          fontWeight: "bold",
        }}
      >
        Jelajah Aman
      </Text>

      <Text
        style={{
          fontSize: typeScale.isi, // Menerapkan typeScale untuk isi
        }}
      >
        Versi 1.0.0
      </Text>

      <Text
        style={{
          fontSize: typeScale.isi, // Menerapkan typeScale untuk isi
        }}
      >
        Dibuat oleh: Reza
      </Text>
    </SafeAreaView>
  );
}