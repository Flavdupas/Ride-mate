import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FC, Ref, useMemo, useState } from "react";
import { Activite } from "../models/Activite";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { GRAY_COLOR } from "../styles/Color";
import React from "react";
import { CustomModal } from "./Modal";
import { ListSport } from "../constants/Sport";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import Cross from "./icons/Cross";
import { TypeParking } from "../constants/TypeParking";

interface BottomSheetFilter {
  bottomSheetModalRef: Ref<BottomSheetModal>;
  data: Activite[];
  equipments: { title: string }[];
  onDeleteFilter: () => void;
}
export const BottomSheetFilter: FC<BottomSheetFilter> = ({
  bottomSheetModalRef,
  data,
  equipments,
  onDeleteFilter
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const snapPoints = useMemo(() => ["50%", "50%"], []);
  const [dataArray, setDataAray] = useState<any[]>([]);
  const user = useSelector((state: RootState) => state.user);
  const [isSportList, setIsSportList] = useState<boolean>(true);
  const [isTypeParking, setIsTypeParking] = useState<boolean>(true);

  const handleClick = (visible: boolean, data: any[], isSportList: boolean, isTypeParking: boolean) => {
    setModalVisible(visible);
    setIsSportList(isSportList);
    setDataAray(data);
    setIsTypeParking(isTypeParking);
  };

  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 24,
      color: GRAY_COLOR,
      fontWeight: "800",
      marginTop: 10,
      textAlign: "center",
    },
    category: {
      fontSize: 18,
      color: GRAY_COLOR,
      fontWeight: "800",
      marginTop: 10,
    },
    button: {
      borderColor: GRAY_COLOR,
      borderWidth: 1,
      height: 40,
      borderRadius: 0,
      paddingHorizontal: 10,
      alignItems: "center",
      marginTop: 5,
      flexDirection: "row",
    },
    txtButton: {
      color: GRAY_COLOR,
      fontSize: 12,
      fontWeight: "500",
    },
    deleteBtn: {
      backgroundColor: "#FF7171",
      height: 40,
      width: 40,
      justifyContent: "center",
      alignItems: "center", 
      borderRadius:50,
      alignSelf:"center",
      marginTop:20,
    },
  });
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
      >
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          data={dataArray}
          user={user}
          sportList={isSportList}
          typeParking={isTypeParking}
        />
        <BottomSheetView style={styles.body}>
          {data && (
            <>
              <Text style={styles.title}>Filtres</Text>
              <Text style={styles.category}>Type parking</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleClick(true, TypeParking, false,true)}
              >
                <Text style={styles.txtButton}>
                  {user.favoriteTypeParking !== null
                    ? TypeParking[user.favoriteTypeParking].title
                    : ""}
                </Text>
              </TouchableOpacity>
              <Text style={styles.category}>Sports</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleClick(true, ListSport, true,false)}
              >
                <Text style={styles.txtButton}>
                  {user.favoriteIndexSport !== null
                    ? ListSport[user.favoriteIndexSport].title
                    : ""}
                </Text>
              </TouchableOpacity>
              <Text style={styles.category}>Équipements</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleClick(true, equipments, false,false)}
              >
                <Text>
                  {user.favoriteIndexEquip !== null
                    ? equipments[user.favoriteIndexEquip].title
                    : ""}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn} onPress={onDeleteFilter}>
                <Cross />
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
