import { router } from "expo-router";
import { User } from "../models/UserModel";
import { resetHistory } from "../utils/router";

export const handleRegisterCheck = async (user: User) => {
  if (user.isRegister) {
    resetHistory().then(() => {
      router.replace("/home/");
    });
  } else {
    resetHistory().then(() => {
      router.replace("/register/");
    });
  }
};
