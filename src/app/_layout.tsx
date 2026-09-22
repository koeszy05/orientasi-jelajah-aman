import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* 1. Menampilkan Tab Navigation sebagai halaman utama */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />

      {/* 2. Mendaftarkan Halaman Detail Dinamis */}
      <Stack.Screen
        name="detail/[kota]"
        options={{ 
          title: "Detail Cuaca", 
          headerBackTitle: "Kembali" 
        }}
      />

      {/* 3. Mendaftarkan Modal Tambah Favorit */}
      <Stack.Screen
        name="tambah-favorit"
        options={{
          presentation: "modal",
          title: "Tambah Favorit",
        }}
      />
    </Stack>
  );
}