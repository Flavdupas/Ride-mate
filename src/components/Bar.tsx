import React from "react";
import { StyleSheet, View } from "react-native";
import { MAIN_COLOR } from "../styles/Color";

export const Bar = () => {
  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      width: "100%",
      height: 2,
      backgroundColor: MAIN_COLOR,
    },
  });

  return <View style={styles.body} />;
};