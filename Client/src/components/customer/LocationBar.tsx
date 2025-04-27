import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useUserStore } from "@/store/userStore";
import { useWS } from "@/service/WSProvider";
import { uiStyles } from "@/styles/uiStyles";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/utils/Constants";
import { logout } from "@/service/authService";
import CustomText from "../shared/CustomText";
import { router } from "expo-router";

const LocationBar = () => {
  const {location} = useUserStore();
  const {disconnect} = useWS();

  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView />
      <View style={uiStyles.container}>
        <TouchableOpacity style={uiStyles.btn} onPress={()=> logout(disconnect)}>
          <Ionicons
            name="log-out-outline"
            size={RFValue(20)}
            color={Colors.text}
            style={{transform : [{rotate  : '180deg'}]}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={uiStyles.locationBar}
          onPress={() => router.navigate("/customer/selectLocation")}
        >
          <View style={uiStyles.dot}></View>
          <CustomText numberOfLines={1} style={uiStyles.locationText}>
            {location?.address || "Getting address..."}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={uiStyles.btn} onPress={()=> router.navigate("/notifications")}>
          <Ionicons
            name="notifications-outline"
            size={RFValue(20)}
            color={Colors.text}
            style={{}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationBar;

