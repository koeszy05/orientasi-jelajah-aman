import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { mintaIzinLokasi, ambilKoordinatSaatIni } from "../../services/locationService";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
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

interface KotaGeocoding {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
}

interface DetailKotaCuaca {
  kota: string;
  suhu: number;
  indeksAQI?: number;
  tingkatAQI: TingkatAQI;
  suhuMaks?: number;
  suhuMin?: number;
  kondisi?: string;
  kecepatanAngin?: number;
  pm25?: number;
  pm10?: number;
}

export default function HalamanUtama() {
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const [teksCari, setTeksCari] = useState("");
  const [daftarKota, setDaftarKota] = useState<KotaGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<KotaGeocoding | null>(null);
  const [dataCuaca, setDataCuaca] = useState<DetailKotaCuaca | null>(null);
  const [daftarFavoritIds, setDaftarFavoritIds] = useState<number[]>([]);

  const [sedangMemuatKota, setSedangMemuatKota] = useState(false);
  const [sedangMemuatCuaca, setSedangMemuatCuaca] = useState(false);

  const teksTertunda = useDebounce(teksCari, 500);

  // Ambil ID favorit setiap kali layar beranda aktif
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then((favs) => setDaftarFavoritIds(favs.map((f) => f.id)));
    }, [])
  );

  useEffect(() => {
    let aktif = true;

    if (teksTertunda.trim().length === 0) {
      setDaftarKota([]);
      setKotaTerpilih(null);
      setDataCuaca(null);
      setSedangMemuatKota(false);
      return;
    }

    async function muatDaftarKota() {
      setSedangMemuatKota(true);
      try {
        const hasil = await cariKota(teksTertunda);
        if (aktif) {
          setDaftarKota(hasil);
          if (hasil && hasil.length > 0) {
            setKotaTerpilih(hasil[0]);
          } else {
            setKotaTerpilih(null);
            setDataCuaca(null);
          }
        }
      } catch {
        if (aktif) {
          setDaftarKota([]);
          setKotaTerpilih(null);
          setDataCuaca(null);
        }
      } finally {
        if (aktif) {
          setSedangMemuatKota(false);
        }
      }
    }

    muatDaftarKota();

    return () => {
      aktif = false;
    };
  }, [teksTertunda]);

  useEffect(() => {
    let aktif = true;

    if (!kotaTerpilih) {
      setDataCuaca(null);
      return;
    }

    async function muatDetailCuaca() {
      setSedangMemuatCuaca(true);
      try {
        const [resCuaca, resAQI] = await Promise.all([
          ambilCuaca(kotaTerpilih!.latitude, kotaTerpilih!.longitude),
          ambilKualitasUdara(kotaTerpilih!.latitude, kotaTerpilih!.longitude),
        ]);

        if (aktif) {
          const c: any = resCuaca;
          const a: any = resAQI;

          const suhuSekarang =
            c?.saatIni?.suhu ?? c?.suhu ?? c?.current_weather?.temperature ?? 0;

          const maks =
            c?.harian?.suhuMaks ??
            c?.harian?.suhuMaksimal ??
            c?.harian?.temperature_2m_max?.[0] ??
            c?.daily?.temperature_2m_max?.[0];

          const min =
            c?.harian?.suhuMin ??
            c?.harian?.suhuMinimal ??
            c?.harian?.temperature_2m_min?.[0] ??
            c?.daily?.temperature_2m_min?.[0];

          const angin =
            c?.saatIni?.kecepatanAngin ??
            c?.current_weather?.windspeed ??
            c?.saatIni?.windspeed;

          const kondisiTeks =
            c?.saatIni?.kondisiCuaca ??
            c?.saatIni?.deskripsi ??
            c?.deskripsi ??
            "Berawan Sebagian";

          setDataCuaca({
            kota: kotaTerpilih!.name,
            suhu: Math.round(suhuSekarang),
            indeksAQI: a?.indeksAQI ?? a?.aqi,
            tingkatAQI: konversiTingkatAQI(a?.indeksAQI ?? a?.aqi ?? 0),
            suhuMaks: maks !== undefined ? Math.round(maks) : undefined,
            suhuMin: min !== undefined ? Math.round(min) : undefined,
            kondisi: kondisiTeks,
            kecepatanAngin: angin !== undefined ? Math.round(angin) : undefined,
            pm25: a?.pm25 ?? a?.pm2_5,
            pm10: a?.pm10,
          });
        }
      } catch {
        if (aktif) {
          setDataCuaca(null);
        }
      } finally {
        if (aktif) {
          setSedangMemuatCuaca(false);
        }
      }
    }

    muatDetailCuaca();

    return () => {
      aktif = false;
    };
  }, [kotaTerpilih]);

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();

    if (status === "denied") {
      setPesanLokasi("Izin lokasi ditolak. Silakan cari kota secara manual di atas.");
      return;
    }

    if (status === "unavailable") {
      setPesanLokasi("Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.");
      return;
    }

    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();

    setKotaTerpilih({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  // Cek apakah kota terpilih sudah tersimpan di daftar favorit
  const sudahFavorit = kotaTerpilih ? daftarFavoritIds.includes(kotaTerpilih.id) : false;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <SearchBox onCari={setTeksCari} />

        <Button title="Gunakan Lokasi Saat Ini" onPress={gunakanLokasiSaatIni} />
        {pesanLokasi && <Text style={{ color: "#dc2626", fontSize: 12 }}>{pesanLokasi}</Text>}

        {daftarKota.length > 0 && !sedangMemuatKota && (
          <Text style={styles.labelTotalKota}>
            Ditemukan {daftarKota.length} kota (Pilih salah satu):
          </Text>
        )}

        {sedangMemuatKota && (
          <ActivityIndicator size="small" style={{ marginVertical: 8 }} />
        )}

        <View style={styles.listKotaWrapper}>
          {daftarKota.map((kota) => {
            const isSelected = kotaTerpilih?.id === kota.id;
            const subWilayah = [kota.admin1, kota.country]
              .filter(Boolean)
              .join(", ");

            return (
              <TouchableOpacity
                key={kota.id}
                onPress={() => setKotaTerpilih(kota)}
                activeOpacity={0.7}
                style={[styles.cityRow, isSelected && styles.cityRowSelected]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.cityName,
                      isSelected && styles.cityNameSelected,
                    ]}
                  >
                    {kota.name}
                  </Text>
                  {subWilayah ? (
                    <Text style={styles.cityRegion}>{subWilayah}</Text>
                  ) : null}
                </View>

                <Text
                  style={
                    isSelected ? styles.badgeSelected : styles.badgeAction
                  }
                >
                  {isSelected ? "Terpilih ✓" : "Lihat →"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {sedangMemuatCuaca && (
          <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
        )}

        {dataCuaca && !sedangMemuatCuaca && kotaTerpilih && (
          <>
            <WeatherCard
              kota={dataCuaca.kota}
              suhu={dataCuaca.suhu}
              indeksAQI={dataCuaca.indeksAQI}
              tingkatAQI={dataCuaca.tingkatAQI}
              suhuMaks={dataCuaca.suhuMaks}
              suhuMin={dataCuaca.suhuMin}
              kondisi={dataCuaca.kondisi}
              kecepatanAngin={dataCuaca.kecepatanAngin}
              pm25={dataCuaca.pm25}
              pm10={dataCuaca.pm10}
            />

            {/* 3. Nonaktifkan tombol jika sudah favorit */}
            <Button
              title={sudahFavorit ? "Sudah di Favorit ✓" : "Tambahkan ke Favorit"}
              disabled={sudahFavorit}
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  labelTotalKota: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 4,
  },
  listKotaWrapper: {
    gap: 6,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  cityRowSelected: {
    borderColor: "#38bdf8",
    backgroundColor: "#f0f9ff",
  },
  cityName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  cityNameSelected: {
    color: "#0284c7",
  },
  cityRegion: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  badgeSelected: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0284c7",
  },
  badgeAction: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0284c7",
  },
});