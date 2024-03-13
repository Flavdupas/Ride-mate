import { BlurView } from "expo-blur";
import React, { FC } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface SearchBarInterface {
  onChange: (arg0: string) => void;
}

export const SearchBar: FC<SearchBarInterface> = ({ onChange }) => {

    const handleChange = (data:string) => {
        onChange(data)
    }

  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      position: "absolute",
      top: 72.5,
      left: 20,
      width: 300,
      height: 35,
      backgroundColor: "rgba(0,0,0,.5)",
      borderRadius: 50,
      overflow: "hidden",
    },
  });

  return (
    <View style={styles.body}>
      <BlurView intensity={80} tint="light" style={{ flex: 1 }}>
        <TextInput
        onChangeText={handleChange}
          placeholder="Recherche ..."
          style={{ height: "100%", width: "100%", paddingHorizontal: 10 }}
        />
      </BlurView>
    </View>
  );
};
