import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { uiStyles } from "@/styles/uiStyles";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "../shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import { resetAndNavigate } from "@/utils/Helpers";

const cubes = [
  { name: "Bike", imageUri: require("@/assets/icons/bike.png") },
  { name: "Auto", imageUri: require("@/assets/icons/auto.png") },
  { name: "Cab Economy", imageUri: require("@/assets/icons/cab.png") },
  { name: "Parcel", imageUri: require("@/assets/icons/parcel.png") },
  { name: "Cab Premium", imageUri: require("@/assets/icons/cab_premium.png") },
];

const SheetContent = () => {
  return (
    <View style={{ height: "100%" }}>
      <TouchableOpacity
        activeOpacity={0.75}
        style={uiStyles.searchBarContainer}
        onPress={() => router.navigate("/customer/selectLocation")}
      >
        <Ionicons name="search-outline" size={RFValue(16)} color="#000" />
        <CustomText fontFamily="Medium" fontSize={11} style={{ opacity: 0.85 }}>
          Where are you going ?
        </CustomText>
      </TouchableOpacity>

      <View style={commonStyles.flexRowBetween}>
        <CustomText fontFamily="Regular" variant="h6">
          Explore
        </CustomText>
        <TouchableOpacity style={[commonStyles.flexRow, { opacity: 0.8 }]}>
          <CustomText fontFamily="Regular" fontSize={10}>
            View All
          </CustomText>
          <Ionicons name="chevron-forward" size={RFValue(14)} color="#222" />
        </TouchableOpacity>
      </View>

      <View style={uiStyles.cubes}>
        {cubes?.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            activeOpacity={0.75}
            style={uiStyles.cubeContainer}
            key={index}
            onPress={() => router.navigate("/customer/selectLocation")}
          >
            <View style={uiStyles.cubeIconContainer}>
              <Image source={item?.imageUri} style={uiStyles.cubeIcon} />
            </View>
            <CustomText
              fontFamily="Medium"
              fontSize={9}
              style={{ textAlign: "center" }}
            >
              {item?.name}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={uiStyles.adSection}>
        <Image
          source={require("@/assets/images/ad_banner.jpg")}
          style={uiStyles.adImage}
        />
      </View>

      <View style={[uiStyles.footerBtn,commonStyles.flexRowBetween]}>
        <View style={{width : '60%'}}>
        <CustomText style={uiStyles.footerBtnTxt} fontFamily="SemiBold" variant="h6">
          Earn With Us.
        </CustomText>
        <CustomText style={[uiStyles.footerBtnTxt,{opacity : 0.7}]} fontFamily="Medium" variant="h8">
          Earn more by becoming a rider.
        </CustomText>
        </View>
        <TouchableOpacity onPress={()=> resetAndNavigate('/rider/auth')} style={[uiStyles.btn,{paddingHorizontal : 16}]}>
          <CustomText variant="h7" fontFamily="SemiBold">Become a Rider</CustomText>
        </TouchableOpacity>
      </View>

      <CustomText
        fontFamily="Light"
        variant="h8"
        style={{ textAlign: "center", marginVertical: 5 }}
      >
        Made by Mohit, Ketan and Hit.
      </CustomText>
    </View>
  );
};

export default SheetContent;
