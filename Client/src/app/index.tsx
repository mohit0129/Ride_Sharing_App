import { Image, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import CustomText from "@/components/shared/CustomText";
import { useUserStore } from "@/store/userStore";
import { tokenStorage } from "@/store/storage";
import { resetAndNavigate } from "@/utils/Helpers";
import { Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "@/service/apiInterceptors";
import { logout } from "@/service/authService";
import { StatusBar } from "expo-status-bar";

interface DecodedToken {
  exp: number;
}

const Main: FC = () => {
  const [loaded, error] = useFonts({
    Bold: require("@/assets/fonts/LexendDeca-Bold.ttf"),
    Regular: require("@/assets/fonts/LexendDeca-Regular.ttf"),
    Light: require("@/assets/fonts/LexendDeca-Light.ttf"),
    Medium: require("@/assets/fonts/LexendDeca-Medium.ttf"),
    SemiBold: require("@/assets/fonts/LexendDeca-SemiBold.ttf"),
  });

  const { user } = useUserStore();
  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = async () => {
    const access_token = tokenStorage.getString("access_token") as string;
    const refresh_token = tokenStorage.getString("refresh_token") as string;

    if (access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        logout();
        Alert.alert("Session Expired!", "Please Login again...");
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          refreshToken();
        } catch (err) {
          console.log(err);
          Alert.alert("Error Refreshing Token");
        }
      }
      if (user) {
        resetAndNavigate("/customer/home");
      } else {
        resetAndNavigate("/rider/home");
      }
    } else {
      resetAndNavigate("/role");
    }
  };

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1400);

      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated]);

  return (
    <View style={[commonStyles.container, { backgroundColor: "#FF9001" }]}>
      <StatusBar style="light" backgroundColor="#FF9001" translucent={false} />

      <Image
        source={require("@/assets/images/logo_t.png")}
        style={splashStyles.img}
      />
      <CustomText variant="h6" fontFamily="Medium" style={splashStyles.text}>
        Ride Sharing App
      </CustomText>
    </View>
  );
};

export default Main;
