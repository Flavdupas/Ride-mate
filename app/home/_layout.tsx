import { Stack } from "expo-router";
import React from "react";

const LayoutHome = () => {
  return (
    <Stack screenOptions={{
        headerShown:false,
    }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default LayoutHome;
