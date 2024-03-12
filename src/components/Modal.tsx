import React, { FC } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Modal,
  StyleSheet,
} from "react-native";

interface CustomModalInterface {
    modalVisible: boolean,
    setModalVisible: (arg0: boolean) => void;
}

export const CustomModal: FC<CustomModalInterface> = ({modalVisible, setModalVisible}) => {
  /* STYLES */
  const styles = StyleSheet.create({
    modal: {
      backgroundColor: "rgba(0,0,0,.3)",
      flex: 1,
      paddingHorizontal: 30,
      paddingVertical: 100,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: 25,
    },
  });

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <View style={styles.modalContainer}></View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
