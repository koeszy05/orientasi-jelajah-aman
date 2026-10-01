import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { ambilCuaca } from "../../services/weatherService";
import { ambilKualitasUdara } from "../../services/airQualityService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { TingkatAQI } from "../../types/cuaca";

interface ItemKotaCuaca {
  id: number;
  name: string;
  suhu: number;
  indeksAQI?: number;
  tingkatAQI: TingkatAQI;
}

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [daftarKotaCuaca, setDaftarKotaCuaca] = useState<ItemKotaCuaca[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);

  const teksTertunda = useDebounce(teksCari, 500);

  useEffect(() => {
    let aktif = true;

    if (teksTertunda.trim().length === 0) {
      setDaftarKotaCuaca([]);
      setSedangMemuat(false);
      return;
    }

    async function muatDataKotaDanCuaca() {
      setSedangMemuat(true);

      try {
        const hasilGeocoding = await cariKota(teksTertunda);

        const dataLengkap = await Promise.all(
          hasilGeocoding.map(async (kota) => {
            try {
              const [dataCuaca, dataAQI] = await Promise.all([
                ambilCuaca(kota.latitude, kota.longitude),
                ambilKualitasUdara(kota.latitude, kota.longitude),
              ]);

              return {
                id: kota.id,
                name: kota.name,
                suhu: Math.round(dataCuaca.saatIni.suhu),
                indeksAQI: dataAQI.indeksAQI,
                tingkatAQI: konversiTingkatAQI(dataAQI.indeksAQI),
              };
            } catch {
              return {
                id: kota.id,
                name: kota.name,
                suhu: 0,
                tingkatAQI: "BAIK" as TingkatAQI,
              };
            }
          })
        );

        if (aktif) {
          setDaftarKotaCuaca(dataLengkap);
        }
      } catch {
        if (aktif) {
          setDaftarKotaCuaca([]);
        }
      } finally {
        if (aktif) {
          setSedangMemuat(false);
        }
      }
    }

    muatDataKotaDanCuaca();

    return () => {
      aktif = false;
    };
  }, [teksTertunda]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <SearchBox onCari={setTeksCari} />

        {daftarKotaCuaca.length > 0 && !sedangMemuat && (
          <Text style={{ fontSize: 13, color: "#666" }}>
            Ditemukan {daftarKotaCuaca.length} kota
          </Text>
        )}

        {sedangMemuat && (
          <ActivityIndicator size="small" style={{ marginVertical: 12 }} />
        )}

        {daftarKotaCuaca.map((kota) => (
          <WeatherCard
            key={kota.id}
            kota={kota.name}
            suhu={kota.suhu}
            indeksAQI={kota.indeksAQI}
            tingkatAQI={kota.tingkatAQI}
          />
        ))}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}