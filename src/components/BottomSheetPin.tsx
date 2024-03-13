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

interface BottomSheetPinInterface {
  refBS: Ref<BottomSheetModal>;
  activite: Activite | null;
  parking: Parking | null;
  onPress: () => void;
  onDismiss: () => void;
}

export const BottomSheetPin: FC<BottomSheetPinInterface> = ({
  refBS,
  activite,
  parking,
  onPress,
  onDismiss,
}) => {
  const [adresse, setAdresse] = useState<Adresse | null>(null);
  const snapPoints = useMemo(() => ["35%", "35%"], []);

  const handleClick = async () => {
    onPress();
  };

  const handleDismiss = () => {
    onDismiss();
  };

  useEffect(() => {
    if (activite) {
      const handle = async () => {
        const data = await getAdresse(activite);
        setAdresse(data);
      };
      handle();
    }
    if (parking) {
      const handle = async () => {
        const data = await getAdresse(parking);
        setAdresse(data);
      };
      handle();
    }
    
  }, [activite, parking]);

  const styles = StyleSheet.create({
    body: {
      flex: 1,
      paddingHorizontal: 10,
      paddingBottom: 35,
      justifyContent: "space-between",
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: GRAY_COLOR,
    },
    city: {
      fontSize: 16,
      fontWeight: "800",
      color: GRAY_COLOR,
    },
    detail: {
      marginTop: 10,
    },
    webSiteBtn: {
      height: 35,
      borderColor: GRAY_COLOR,
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,.35)",
      marginTop: 10,
    },
    nearBtn: {
      height: 50,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: MAIN_COLOR,
      marginTop: 10,
    },
    nearTxt: {
      fontWeight: "700",
      color: GRAY_COLOR,
      fontSize: 18,
    },
    parkingTxt: {
      marginTop:10,
    }
  });
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={refBS}
        index={1}
        snapPoints={snapPoints}
        onDismiss={handleDismiss}
      >
        <BottomSheetView style={styles.body}>
          {activite && !parking && (
            <>
              <View>
                <Text style={styles.title}>
                  {croppedText(activite.activite, 30)}
                </Text>
                <Text style={styles.city}>
                  {adresse?.display_name ? croppedText(adresse?.display_name,200)  : "chargement ..."}
                </Text>
                <Text style={styles.detail}>
                  {activite.nom} - {activite.nat_libe}
                </Text>
                <Text>{activite.nom_equip}</Text>
              </View>
              <TouchableOpacity onPress={handleClick} style={styles.nearBtn}>
                <Text style={styles.nearTxt}>Parking le plus proche</Text>
              </TouchableOpacity>
            </>
          )}
          {parking && (
            <View>
              <Text style={styles.title}>{parking.voie}</Text>
              <Text style={styles.city}>
                  {adresse?.display_name ?? "chargement ..."}
                </Text>
              <Text style={styles.parkingTxt}>Accès au parking : {parking.acces}</Text>
              <Text>Type de parking : {parking.type}</Text>
              {parking.securise && <Text>Sécurisé : {parking.securise}</Text>}
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
