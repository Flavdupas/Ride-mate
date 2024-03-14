import React, { FC } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GRAY_COLOR } from "../styles/Color";
import Position from "./icons/Position";

interface LocationBtnInterface {
    onPress: () => void;
}

export const LocationBtn: FC<LocationBtnInterface> = ({onPress}) => {
  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      height: 50,
      width: 50,
      backgroundColor: GRAY_COLOR,
      position: "absolute",
      bottom: 160,
      right: 40,
      borderRadius: 50,
    },
    touchable: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <TouchableWithoutFeedback>
      <View style={styles.body}>
        <TouchableOpacity style={styles.touchable} onPress={onPress}>
          <Position />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};
