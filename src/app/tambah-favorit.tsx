import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ModalTambahFavorit() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.judul}>Tambah ke Favorit</Text>
      <Text>Simpan kota ini ke daftar pencarian cepat.</Text>

      <Button title="Tutup" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  judul: {
    fontSize: 20,
    fontWeight: "bold",
  },
});