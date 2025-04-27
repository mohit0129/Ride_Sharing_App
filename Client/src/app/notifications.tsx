import { View, Text } from "react-native";
import React from "react";
import { commonStyles } from "@/styles/commonStyles";
import CustomHeader from "@/components/shared/CustomHeader";
import { notificationStyles } from "@/styles/notificationStyles";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";

const notifications = () => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Notifications" />
      <View style={notificationStyles.notificationContainer}>
        <View style={commonStyles.center}>
          <Ionicons
            name="notifications-circle-outline"
            size={RFValue(60)}
            color="#666"
            style={{marginBottom : 10}}
          />

          <CustomText fontFamily="Medium" variant="h7">
            No Notification Yet!
          </CustomText>
        </View>
      </View>
    </View>
  );
};

export default notifications;
