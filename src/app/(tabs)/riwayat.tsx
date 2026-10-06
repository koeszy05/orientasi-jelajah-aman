// src/app/(tabs)/riwayat.tsx
import { useState, useCallback } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../types/favorit";

export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, [])
  );

  function konfirmasiHapus(kota: KotaFavorit) {
    Alert.alert(
      "Konfirmasi Hapus",
      `Yakin hapus ${kota.nama}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await hapusFavorit(kota.id);
            setDaftarFavorit((prev) => prev.filter((k) => k.id !== kota.id));
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>
      
      {/* 2. Tampilkan jumlah favorit */}
      <Text style={{ fontSize: 13, color: "#64748b" }}>
        Tersimpan {daftarFavorit.length} kota
      </Text>

      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}

      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#f1f5f9",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "500" }}>{kota.nama}</Text>
          {/* 1. Tombol panggil konfirmasi hapus */}
          <Button title="Hapus" color="#dc2626" onPress={() => konfirmasiHapus(kota)} />
        </View>
      ))}
    </SafeAreaView>
  );
}