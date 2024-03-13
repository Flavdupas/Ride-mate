import React, { FC, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  View,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { GRAY_COLOR } from "../styles/Color";
import { useDispatch } from "react-redux";
import { updateFavoriteIndexEquip, updateFavoriteIndexSport } from "../store/user/User";
import { User } from "../models/UserModel";

interface CustomModalInterface {
  modalVisible: boolean,
  setModalVisible: (arg0: boolean) => void;
  data: { title: string }[];
  user: User;
  sportList: boolean
}

export const CustomModal: FC<CustomModalInterface> = ({ modalVisible, setModalVisible, data, user, sportList }) => {

  const dispatch = useDispatch();

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
      padding: 25,

    },
    btn: {
      height: 40,
      width: '100%',
      borderColor: GRAY_COLOR,
      borderWidth: 1,
      marginVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const handleClick = (index: number) => {
    if (sportList) {
      dispatch(updateFavoriteIndexSport(index));
      dispatch(updateFavoriteIndexEquip(null));
      setModalVisible(false);
    } else {
      dispatch(updateFavoriteIndexEquip(index));
      setModalVisible(false);
    }

  }
  
  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
            <ScrollView style={styles.modalContainer}>
              {data.map((item, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => handleClick(index)}>
                    {sportList && <View style={[styles.btn, { backgroundColor: sportList && user.favoriteIndexSport === index ? GRAY_COLOR : "#fff" }]}>
                      <Text style={[{ color: sportList && user.favoriteIndexSport === index ? "#fff" : GRAY_COLOR, fontWeight: sportList && user.favoriteIndexSport === index ? '700' : "normal" }]}>{item.title}</Text>
                    </View>}
                    {!sportList && <View style={[styles.btn, { backgroundColor: user.favoriteIndexEquip === index ? GRAY_COLOR : "#fff" }]}>
                      <Text style={[{ color: user.favoriteIndexEquip === index ? "#fff" : GRAY_COLOR, fontWeight: user.favoriteIndexEquip === index ? '700' : "normal" }]}>{item.title}</Text>
                    </View>}
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
