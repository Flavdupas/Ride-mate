import { Bar } from "@/src/components/Bar";
import { SportView } from "@/src/components/SportView";
import { ListSport } from "@/src/constants/Sport";
import {
  updateFavoriteIndexSport,
  updateFavoriteSports,
  updateRegister,
} from "@/src/store/user/User";
import { GRAY_COLOR, MAIN_COLOR } from "@/src/styles/Color";
import GlobalStyle from "@/src/styles/Global";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const Index = () => {
  /* LOGIQUE */
  const SPORTS = [...ListSport];
  const [sportChoosen, setSportChoosen] = useState<number | null>(null);
  const dispatch = useDispatch();

const handleClick = () => {
  // Met à jour le store de l'utilisateur
  dispatch(updateFavoriteIndexSport(sportChoosen));
  dispatch(updateRegister(true));
  // Navigue vers l'écran d'accueil en remplaçant l'écran actuel
  router.replace("/home/");
};

  /* STYLES */
  const styles = StyleSheet.create({
    body: {
      backgroundColor: GRAY_COLOR,
      padding: 10,
    },
    scrollView: {
      paddingTop: 100,
    },
    title: {
      color: MAIN_COLOR,
      fontSize: 36,
      fontWeight: "700",
      textAlign: "center",
      marginVertical: 5,
    },
    text: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "500",
      textAlign: "left",
      marginVertical: 30,
    },
    sportWrapper: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 25,
      paddingBottom: 250,
    },
    btnWrapper: {
      width: 325,
      height: 50,
      backgroundColor: MAIN_COLOR,
      position: "absolute",
      bottom: 40,
      alignSelf: "center",
      borderRadius: 50,
      overflow: "hidden",
    },
    btn: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    txtBtn: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
    },
  });

  return (
    <View style={[GlobalStyle.body, styles.body]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Bar />
        <Text style={styles.title}>RIDE MATE</Text>
        <Bar />
        <Text style={styles.text}>
          Sélectionnez des activités qui vous intéressent afin de repérer les
          parkings libres les plus proches
        </Text>
        <View style={styles.sportWrapper}>
          {SPORTS.map((sport, index) => {
            return (
              <SportView
                sport={sport}
                key={index}
                sportChoosen={sportChoosen}
                setSportChoosen={setSportChoosen}
              />
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <TouchableOpacity style={styles.btn} onPress={handleClick}>
          <Text style={styles.txtBtn}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Index;
