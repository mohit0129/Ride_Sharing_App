import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { FC } from "react";
import { commonStyles } from "@/styles/commonStyles";
import CustomText from "./CustomText";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { uiStyles } from "@/styles/uiStyles";
import { router } from "expo-router";

const CustomHeader: FC<{ title: string; right?: any }> = ({ title, right }) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity activeOpacity={0.8} onPress={()=> router.back()} style={uiStyles.btn}>
        <Ionicons name="chevron-back" size={RFValue(20)} color="#000" />
      </TouchableOpacity>
      <CustomText
        style={{ width: "72%",textAlign : 'center' }}
        fontFamily="SemiBold"
        fontSize={16}
        numberOfLines={1}
      >
        {title}
      </CustomText>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#ffff",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default CustomHeader;
