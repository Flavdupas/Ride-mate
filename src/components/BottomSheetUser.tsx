import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { FC, Ref, useEffect, useMemo, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Activite } from "../models/Activite";
import { Parking } from "../models/Parking";
import { GRAY_COLOR, MAIN_COLOR } from "../styles/Color";
import { croppedText } from "../utils/string";
import { Polyline } from "react-native-maps";
import { getAdresse } from "../hooks/MapsHooks";
import { Adresse } from "../models/Adresse";

interface BottomSheetUserInterface {
  refBS: Ref<BottomSheetModal>;
  onPress: () => void;
}

export const BottomSheetUser: FC<BottomSheetUserInterface> = ({ refBS, onPress }) => {
  const [adresse, setAdresse] = useState<Adresse | null>(null);
  const snapPoints = useMemo(() => ["25%", "25%"], []);

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: 10,
      paddingBottom: 35,
      justifyContent: "center",
    },
    btn: {
      height: 50,
      width: "100%",
      backgroundColor: GRAY_COLOR,
      borderColor: GRAY_COLOR,
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
  });
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal ref={refBS} index={1} snapPoints={snapPoints}>
        <BottomSheetView style={styles.body}>
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.title}>Trouver le parking de vélo le plus proche</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
