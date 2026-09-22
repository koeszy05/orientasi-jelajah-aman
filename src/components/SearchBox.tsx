// components/SearchBox.tsx

import { useState } from "react";
import { Button, TextInput, View } from "react-native";

interface SearchBoxProps {
  onCari: (kota: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const [teks, setTeks] = useState("");

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
      }}
    >
      <TextInput
        placeholder="Kota"
        value={teks}
        onChangeText={setTeks}
        style={{
          flex: 1,
          minWidth: 0,
          borderWidth: 1,
          padding: 8,
        }}
      />

      <Button
        title="Cari"
        onPress={() => onCari(teks)}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
      />
    </View>
  );
}