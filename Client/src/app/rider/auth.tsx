import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import { authStyles } from "@/styles/authStyles";
import { MaterialIcons } from "@expo/vector-icons";
import CustomText from "@/components/shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import PhoneInput from "@/components/shared/PhoneInput";
import { useWS } from "@/service/WSProvider";
import CustomButton from "@/components/shared/CustomButton";
import { signin } from "@/service/authService";
import { TextInput } from "react-native-gesture-handler";
import { Keyboard } from "react-native";

const RiderAuth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!phone && phone.length !== 10) {
      Alert.alert("Please Enter your 10 digit phone number");
      return;
    }
    setLoading(true);
    try {
      await signin({ role: "rider", phone }, updateAccessToken);
    } catch (error) {
      console.log("Error Signin");
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 220}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.flexRowBetween}>
            <Image
              source={require("@/assets/images/logo_t.png")}
              style={authStyles.logo}
            />
            <TouchableOpacity style={authStyles.flexRowGap}>
              <MaterialIcons name="help" size={18} color="grey" />
              <CustomText fontFamily="Medium" variant="h7">
                Help
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={styles.icon_container}>
            <Image
              source={require("@/assets/images/rider.jpg")}
              resizeMode="cover"
              style={{ width: "100%", height: "110%" }}
            />
          </View>

          <CustomText fontFamily="SemiBold" variant="h6">
            Good to see you, Rider!
          </CustomText>
          <CustomText
            fontFamily="Regular"
            variant="h7"
            style={commonStyles.lightText}
          >
            Enter your phone number to proceed...
          </CustomText>
          <PhoneInput
            value={phone}
            onChangeText={setPhone}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={authStyles.footerContainer}>
        <CustomText
          variant="h8"
          fontFamily="Medium"
          style={[
            commonStyles.lightText,
            { textAlign: "center", marginHorizontal: 20 },
          ]}
        >
          By continuing, you agree to the terms and privacy policy of the
          RideEase.
        </CustomText>
        <CustomButton
          title="NEXT"
          onPress={handleNext}
          loading={loading}
          disabled={phone.length < 10 || loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon_container: {
    backgroundColor: "#023dfe",
    marginBottom: 20,
    // height : 300,
    width: "100%",
    aspectRatio: 1,
    borderTopLeftRadius: 1000,
    borderRadius: 30,
    overflow: "hidden",
    // borderBottomRightRadius : 1000,
  },
});

export default RiderAuth;
