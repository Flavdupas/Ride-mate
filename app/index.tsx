import GlobalStyle from "@/src/styles/Global";
import { StyleSheet, View, Text, Image } from "react-native";
import LottieView from "lottie-react-native";
import { MAIN_COLOR } from "@/src/styles/Color";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { User } from "@/src/models/UserModel";
import { delay } from "@/src/utils/time";
import { handleRegisterCheck } from "@/src/hooks/UserHooks";

const Index = () => {
  /* LOGIQUE */
  const user: User = useSelector((state: RootState) => state.user);

  //Vérifie si l'utilisateur est enregistré ou pas
  useEffect(() => {
    delay(2000).then(() => {
      handleRegisterCheck(user);
    });
  }, []);

  /* STYLE */
  const styles = StyleSheet.create({
    body: {
      backgroundColor: MAIN_COLOR,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "flex-end",
      paddingBottom: 25,
    },
    loadingWrapper: {
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 25,
      fontWeight: "600",
    },
    loading: {
      height: 100,
      width: 150,
    },
    logo: {
      position: "absolute",
      top: 125,
      height: 200,
      width: 140,
      resizeMode: "contain",
    },
  });

  /* RENDER */
  return (
    <View style={[GlobalStyle.body, styles.body]}>
      <Image
        source={require("@/src/assets/icons/logo-text.png")}
        style={styles.logo}
      />
      <View style={styles.loadingWrapper}>
        <Text style={styles.loadingText}>Chargement en cours ...</Text>
        <LottieView
          autoPlay
          source={require("../src/assets/animation/loading.json")}
          style={styles.loading}
        />
      </View>
    </View>
  );
};

export default Index;
