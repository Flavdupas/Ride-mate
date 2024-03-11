import { router } from "expo-router";

export const resetHistory = async () => {
  while (router.canGoBack()) {
    router.back();
  }
};