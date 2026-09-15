// app/index.tsx

import { useEffect, useState } from "react";
import { View } from "react-native";

import WeatherCard from "../components/WeatherCard";
import SearchBox from "../components/SearchBox";
import RiwayatList from "../components/RiwayatList";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    setKotaAktif(kota);

    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        paddingTop: 120,
        gap: 16,
      }}
    >
      <SearchBox onCari={handleCari} />

      <WeatherCard
        kota={kotaAktif}
        suhu={29}
        tingkatAQI="BAIK"
      />

      <RiwayatList daftarKota={riwayat} />
    </View>
  );
}
