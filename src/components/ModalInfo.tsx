import React, { FC } from "react";
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { GRAY_COLOR, MAIN_COLOR } from "../styles/Color";

interface ModalInfoInterface {
  visible: boolean;
  onPress: () => void;
}

export const ModalInfo: FC<ModalInfoInterface> = ({ visible, onPress }) => {
  /* LOGIQUE */
  const handleClick = () => {
    Linking.openURL("https://www.angers.fr/services-demarches/contacter-la-mairie/formulaire-de-contact/index.html");
  }
  /* STYLES */
  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,.6)",
      padding: 30,
      paddingVertical: 100,
    },
    body: {
      height: 225,
      width: "100%",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 10,
      justifyContent: "space-between",
    },
    txt: {
      fontSize: 14,
    },
    btn: {
      backgroundColor: GRAY_COLOR,
      width: "100%",
      height: 35,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    btnTxt: {
      color: "#fff",
    },
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback>
            <View style={styles.body}>
              <Text style={styles.txt}>
                L’ensemble des informations présentes au sein de l’application
                Ride Mate sont à but non lucratif. Celles-ci sont fournies par
                la mairie d’Angers. Notre application facilite la vie des
                cyclistes en leur permettant de localiser rapidement les
                parkings à vélos les plus proches par rapport aux salles de
                sport dans la ville d’Angers.
              </Text>
              <TouchableOpacity style={styles.btn} onPress={handleClick}>
                <Text style={styles.btnTxt}>Une idée ? Contactez-nous</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
