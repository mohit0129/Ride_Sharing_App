import React from "react";
import { Stack, useSegments } from "expo-router";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { WSProvider } from "@/service/WSProvider";
import { StatusBar } from "react-native";
import { Colors } from "@/utils/Constants";
import BottomNavBar from "./customer/BottomNavBar";
import BottomNavBar2 from "./rider/BottomNavBar";
// import NoInternet from "@/components/shared/NoInternet";

const Layout = () => {

  const segments = useSegments();

  const showBottomNavBar = [
    'customer/home',
    'customer/services',
    'customer/activity',
    'customer/account',
  ].some(route => segments.join('/') === route);

  const showBottomNavBar2 = [
    'rider/home',
    'rider/activity',
    'rider/account',
  ].some(route => segments.join('/') === route);


  return (
    <WSProvider>

      {/* <NoInternet /> */}

      <Stack
        screenOptions={{
          headerShown: false,
          animation: "default",
        }}
        initialRouteName="index"
      >
        <Stack.Screen name="index" options={{ animation: "fade" }} />
        <Stack.Screen name="role" />
        <Stack.Screen name="customer/home" />
        <Stack.Screen name="customer/auth" />
        <Stack.Screen name="customer/liveride" />
        <Stack.Screen name="customer/ridebooking" />
        <Stack.Screen name="customer/selectLocation" />

        <Stack.Screen name='customer/services' />
        <Stack.Screen name='customer/account' />
        <Stack.Screen name='customer/activity' />

        <Stack.Screen name="rider/auth" />
        <Stack.Screen name="rider/home" />
        <Stack.Screen name="rider/liveride" />
        <Stack.Screen name="notifications" />
      </Stack>

      {/* Conditionally render the BottomNavBar */}
      {showBottomNavBar && <BottomNavBar />}
      {showBottomNavBar2 && <BottomNavBar2 />}

    </WSProvider>
  );
};

export default gestureHandlerRootHOC(Layout);
