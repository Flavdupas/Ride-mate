import GlobalStyle from "@/src/styles/Global";
import { StyleSheet, View, Text, Image } from "react-native";
import LottieView from "lottie-react-native";
import { MAIN_COLOR } from "@/src/styles/Color";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { User } from "@/src/models/UserModel";
import { handleRegisterCheck } from "@/src/hooks/UserHooks";
import { getActivity, getParking } from "@/src/hooks/MapsHooks";
import { updateActivite, updateParking } from "@/src/store/data/Data";

const Index = () => {
  /* LOGIQUE */
  const user: User = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handle = async () => {
      const activite = await getActivity();
      const parking = await getParking();
      dispatch(updateActivite(activite));
      dispatch(updateParking(parking));
      handleRegisterCheck(user);
    }
    handle();
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
