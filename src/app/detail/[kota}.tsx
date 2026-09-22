import { View, Text, Button, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.judul}>Detail Cuaca: {kota}</Text>
      <Text>Suhu: 29°C</Text>
      <Text>Kondisi: Cerah Berawan</Text>

      {/* Tombol menuju modal tambah favorit */}
      <Button
        title="Tambahkan ke Favorit"
        onPress={() => router.push("../tambah-favorit")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  judul: {
    fontSize: 20,
    fontWeight: "bold",
  },
});