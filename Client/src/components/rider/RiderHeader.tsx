import {
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { rideStyles } from "@/styles/rideStyles";
import { commonStyles } from "@/styles/commonStyles";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { logout } from "@/service/authService";
import CustomText from "../shared/CustomText";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { riderStyles } from "@/styles/riderStyles";
import { uiStyles } from "@/styles/uiStyles";
import { router } from "expo-router";

const RiderHeader = () => {
  const { emit, disconnect } = useWS();
  const { setLocation, setOnDuty, onDuty ,todayEarning ,resetEarning} = useRiderStore();
  const isFocused = useIsFocused();

  const toggleOnDuty = async () => {
    if (onDuty) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to go on duty."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, heading } = location.coords;
      setLocation({
        latitude: latitude,
        longitude: longitude,
        address: "SomeWhere",
        heading: heading as number,
      });

      emit("goOnDuty", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        heading: heading,
      });
    } else {
      emit("goOffDuty");
    }
  };

  useEffect(() => {
    if (isFocused) {
      toggleOnDuty();
    }
  }, [isFocused, onDuty]);

  useEffect(()=> resetEarning() ,[])

  return (
    <>
      <View style={riderStyles.headerContainer}>
        <SafeAreaView />

        <View style={commonStyles.flexRowBetween}>
          <View style={[uiStyles.btn, { padding: 6 }]}>
            <MaterialCommunityIcons
              name="power"
              size={RFValue(22)}
              color="red"
              onPress={() => logout(disconnect)}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={riderStyles.toggleContainer}
            onPress={() => setOnDuty(!onDuty)}
          >
            <CustomText
              fontFamily="Medium"
              fontSize={12}
              style={{ color: "#000" }}
            >
              {onDuty ? "ON DUTY" : "OFF DUTY"}
            </CustomText>

            <Image
              source={
                onDuty
                  ? require("@/assets/icons/switch_on.png")
                  : require("@/assets/icons/switch_off.png")
              }
              style={rideStyles.icon}
            />
          </TouchableOpacity  >
          {/* <View style={[uiStyles.btn, { padding: 6 }]}> */}
          <Ionicons
            name="notifications-outline"
            size={RFValue(22)}
            color="#000"

            onPress={()=>router.navigate('/notifications')}
          />
          {/* </View> */}
        </View>
      </View>

      <View style={riderStyles.earningContainer}>
        <CustomText
          fontFamily="Regular"
          fontSize={13}
          style={{ color: "#fff" }}
        >
          Today's Earning
        </CustomText>
        <View
          style={[
            commonStyles.flexRowGap,
            {
              backgroundColor: "#555",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            },
          ]}
        >
          <CustomText fontFamily="Bold" style={{ color: "#21ff62" }}>
            ₹{todayEarning.toFixed(2)}
          </CustomText>
          <Ionicons
            name="caret-down-circle-sharp"
            size={RFValue(16)}
            color="#fff"
          />
        </View>
      </View>
    </>
  );
};

export default RiderHeader;
