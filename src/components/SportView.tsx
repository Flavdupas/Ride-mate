import React, { FC, useState } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Sport } from "../models/SportModel";
import { GRAY_COLOR, MAIN_COLOR } from "../styles/Color";

interface SportViewInterface {
  sport: Sport;
  sportChoosen: number|null;
  setSportChoosen: (sportChoosen: number) => void;
}

export const SportView: FC<SportViewInterface> = ({
  sport,
  sportChoosen,
  setSportChoosen,
}) => {
  /* LOGIQUE */

  const handleClick = () => {
    if (sport.index === sportChoosen) {
      setSportChoosen(-1);
    } else {
      setSportChoosen(sport.index);
    }
  };

  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      height: 100,
      width: 100,
      borderColor: MAIN_COLOR,
      borderWidth: 2,
      backgroundColor:
        sportChoosen === sport.index ? MAIN_COLOR : "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      color: sportChoosen === sport.index ? GRAY_COLOR : "rgba(255,255,255,.8)",
      fontWeight: "700",
      textAlign: "center",
    },
  });

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View style={styles.body}>
        <Text style={styles.title}>{sport.title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
