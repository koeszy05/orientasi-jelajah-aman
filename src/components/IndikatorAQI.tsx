import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

export default function IndikatorAQI({
  kota,
  indeksAQI,
  tingkat,
  diperbaruiPada,
}: LaporanUdara) {
  // Menentukan warna berdasarkan nilai tingkat
  let warna = "green";
  if (tingkat === "SEDANG") warna = "orange";
  if (tingkat === "TIDAK_SEHAT") warna = "red";
  if (tingkat === "BERBAHAYA") warna = "purple";

  return (
    <View style={{ padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginTop: 10 }}>
      <Text style={{ fontWeight: "bold" }}>Kualitas Udara {kota}</Text>
      <Text style={{ color: warna, fontSize: 16, fontWeight: "bold" }}>
        Indeks: {indeksAQI} ({tingkat})
      </Text>
      {diperbaruiPada && (
        <Text style={{ fontSize: 12, color: "gray" }}>
          Diperbarui: {diperbaruiPada}
        </Text>
      )}
    </View>
  );
}