import { router } from "expo-router";
import { User } from "../models/UserModel";
import { resetHistory } from "../utils/router";

export const handleRegisterCheck = async (user: User) => {
  // Vérifie si l'utilisateur est enregistré
  if (user.isRegister) {
    // Redirige vers l'écran d'accueil
    resetHistory().then(() => {
      // Utilise router.replace pour une navigation fluide
      router.replace("/home/");
    });
  } else {
    // Sinon, redirige vers l'écran d'enregistrement
    resetHistory().then(() => {
      router.replace("/register/");
    });
  }
};
