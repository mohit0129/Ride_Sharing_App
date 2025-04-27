import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { authStyles } from "@/styles/authStyles";
import { MaterialIcons } from "@expo/vector-icons";
import CustomText from "@/components/shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import PhoneInput from "@/components/shared/PhoneInput";
import { useWS } from "@/service/WSProvider";
import CustomButton from "@/components/shared/CustomButton";
import { signin } from "@/service/authService";

const CustomerAuth = () => {
  const {updateAccessToken} = useWS();
  const [phone, setPhone] = useState("");
  const [loading,setLoading] = useState(false);

  const handleNext = async () => {
    if (!phone && phone.length !== 10) {
      Alert.alert("Please Enter your 10 digit phone number");
      return;
    }
    setLoading(true)
    await signin({role : 'customer',phone},updateAccessToken)
    setLoading(false)
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container} automaticallyAdjustKeyboardInsets>
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

        <CustomText fontFamily="Medium" variant="h6">
          What's your number ?
        </CustomText>
        <CustomText
          fontFamily="Regular"
          variant="h7"
          style={commonStyles.lightText}
        >
          Enter your phone number to proceed...
        </CustomText>
        <PhoneInput value={phone} onChangeText={setPhone} />
      </ScrollView>

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

export default CustomerAuth;

