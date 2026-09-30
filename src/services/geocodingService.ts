// src/services/geocodingService.ts
import { GeocodingResponse, HasilGeocoding } from "../types/geocoding";

const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function cariKota(nama: string): Promise<HasilGeocoding[]> {
  const query = nama.trim();
  if (!query) {
    return [];
  }

  const url = `${BASE_URL}?name=${encodeURIComponent(query)}&count=5&format=json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Server API merespons dengan status ${response.status}: ${response.statusText}`);
    }

    const data: GeocodingResponse = await response.json();
    return data.results ?? [];
  } catch (error: any) {
    console.error("Kesalahan pada geocodingService:", error);
    throw error;
  }
}