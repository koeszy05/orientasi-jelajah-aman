// src/types/location.ts

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // Provinsi / wilayah administratif (opsional jika tidak ada)
}

export interface GeocodingResponse {
  results?: GeocodingResult[]; // Bersifat opsional karena saat data kosong results tidak dikirim
  generationtime_ms?: number;
}