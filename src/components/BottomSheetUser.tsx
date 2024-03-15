import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { FC, Ref, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { GRAY_COLOR } from "../styles/Color";

interface BottomSheetUserInterface {
  refBS: Ref<BottomSheetModal>;
  onPress: () => void;
}

export const BottomSheetUser: FC<BottomSheetUserInterface> = ({ refBS, onPress }) => {
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
