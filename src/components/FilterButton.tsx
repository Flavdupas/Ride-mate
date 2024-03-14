import { TouchableOpacity, View, StyleSheet } from "react-native";
import FilterIcon from "./icons/Filter";
import React, { FC } from "react";
import { GRAY_COLOR } from "../styles/Color";

interface FilterButtonInterface {
    onPress?: () => void
}

export const FilterButton:FC<FilterButtonInterface> = ({onPress}) => {
  /* STYLE */
  const styles = StyleSheet.create({
    body: {
      height: 50,
      width: 50,
      backgroundColor: GRAY_COLOR,
      position:"absolute",
      bottom:100,
      right:40,
      borderRadius:50,
    },
    logoWrapper: {
        justifyContent:"center",
        alignItems:"center",
        flex:1,
    }
  });

  return (
    <View style={styles.body}>
      <TouchableOpacity style={styles.logoWrapper} onPress={onPress}>
        <FilterIcon />
      </TouchableOpacity>
    </View>
  );
};