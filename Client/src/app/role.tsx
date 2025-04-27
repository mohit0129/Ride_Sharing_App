import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { roleStyles } from "@/styles/roleStyles";
import CustomText from "@/components/shared/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/commonStyles";
import { StatusBar } from "expo-status-bar";

const Role = () => {
  const handleCustomerPress = () => {
    router.navigate("./customer/Auth/PhoneInput");
    // router.navigate("/customer/auth");
  };

  const handleRiderPress = () => {
    router.navigate("./rider/Auth/PhoneInput");
    // router.navigate("/rider/auth");
  };

  return (
    <View style={roleStyles.container}>
      <StatusBar style="dark" backgroundColor="#fff" translucent={false} />

      <View style={roleStyles.header}>
        <Image
          source={require("@/assets/images/logo_t.png")}
          style={roleStyles.logo}
        />
      </View>
      <View style={roleStyles.roleContainer}>
        <CustomText fontFamily="Bold" variant="h5" style={{ color: "#fff" }}>
          Choose Your User Type
        </CustomText>

        <TouchableOpacity
          activeOpacity={0.75}
          style={roleStyles.card}
          onPress={handleCustomerPress}
        >
          <View style={roleStyles.cardContent}>
            <Image
              source={require("@/assets/images/customer.jpg")}
              style={roleStyles.image}
            />
            <View style={[commonStyles.flexRowBetween]}>
              <View style={{ width: "85%" }}>
                <CustomText
                  variant="h4"
                  fontFamily="SemiBold"
                  style={roleStyles.title}
                >
                  CUSTOMER
                </CustomText>
                <CustomText
                  variant="h7"
                  fontFamily="Medium"
                  style={roleStyles.description}
                >
                  Are your a customer? Order rides and deliveries easily.
                </CustomText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={25}
                color="#ccc"
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          style={roleStyles.card}
          onPress={handleRiderPress}
        >
          <View style={roleStyles.cardContent}>
            <Image
              source={require("@/assets/images/rider.jpg")}
              style={roleStyles.image}
            />
            <View style={[commonStyles.flexRowBetween]}>
              <View style={{ width: "85%" }}>
                <CustomText
                  variant="h4"
                  fontFamily="SemiBold"
                  style={roleStyles.title}
                >
                  RIDER
                </CustomText>
                <CustomText
                  variant="h7"
                  fontFamily="Medium"
                  style={roleStyles.description}
                >
                  Are your a rider? Join us to drive and deliver with RideEase.
                </CustomText>
              </View>
              <Ionicons
                name="chevron-forward"
                size={25}
                color="#ccc"
              />
            </View>
          </View>
        </TouchableOpacity>

        <CustomText fontFamily="Bold" variant="h3" style={roleStyles.footer}>
          RideEase - Fast, Safe & Affordable Rides - Anytime, Anywhere!
        </CustomText>
      </View>
    </View>
  );
};

export default Role;
