import { View, Text } from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { rideStyles } from "@/styles/rideStyles";
import CustomText from "../shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import { orderStyles } from "@/styles/riderStyles";
import SwipeButton from "rn-swipe-button";
const RiderActionButton: FC<{
  ride: any;
  color?: string;
  title: string;
  onPress: () => void;
}> = ({ onPress, ride, title, color }) => {
  const CheckoutButton: any = () => {
    <Ionicons
      name="arrow-forward-sharp"
      size={RFValue(32)}
      color="#fff"
      style={{ bottom: 2 }}
    />;
  };

  return (
    <View style={rideStyles.swipeableContaninerRider}>
      <View style={commonStyles.flexRowBetween}>
        <CustomText
          fontSize={11}
          numberOfLines={1}
          fontFamily="Medium"
          style={{ marginTop: 10, marginBottom: 3 }}
        >
          Meet the Customer
        </CustomText>
        <View style={commonStyles.flexRow}>
          <Ionicons name="call-outline" size={RFValue(12)} color="#444" />
          <CustomText
            fontSize={11}
            numberOfLines={1}
            fontFamily="Medium"
            style={{ marginTop: 10, marginBottom: 3 }}
          >
            +91{" "}
            {ride?.customer?.phone &&
              ride?.customer?.phone?.slice(0, 5) +
                " " +
                ride?.customer?.phone?.slice(5)}
          </CustomText>
        </View>
      </View>

      <View style={orderStyles.locationsContainer}>
        <View style={orderStyles.flexRowBase}>
          <View>
            <View style={orderStyles.pickupHollowCircle} />
            <View style={orderStyles.continuousLine} />
          </View>
          <View style={orderStyles.infoText}>
            <CustomText fontFamily="SemiBold" numberOfLines={1} fontSize={11}>
              {ride?.pickup?.address?.slice(0, 10)}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontFamily="Medium"
              fontSize={9.5}
              style={orderStyles.label}
            >
              {ride?.pickup?.address}
            </CustomText>
          </View>
        </View>
        <View style={orderStyles.flexRowBase}>
          <View>
            <View style={orderStyles.dropHollowCircle} />
          </View>
          <View style={orderStyles.infoText}>
            <CustomText fontFamily="SemiBold" numberOfLines={1} fontSize={11}>
              {ride?.drop?.address?.slice(0, 10)}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontFamily="Medium"
              fontSize={9.5}
              style={orderStyles.label}
            >
              {ride?.drop?.address}
            </CustomText>
          </View>
        </View>
      </View>

      <SwipeButton
        containerStyles={rideStyles.swipeButtonContainer}
        height={30}
        shouldResetAfterSuccess={true}
        resetAfterSuccessAnimDelay={200}
        onSwipeSuccess={onPress}
        railBackgroundColor={color}
        railStyles={rideStyles.railStyles}
        railBorderColor="transparent"
        railFillBackgroundColor="rgba(255,255,255,0.5)"
        railFillBorderColor="rgba(255,255,255,0.6)"
        titleColor="#fff"
        titleFontSize={RFValue(13)}
        titleStyles={rideStyles.titleStyles}
        thumbIconComponent={CheckoutButton}
        thumbIconStyles={rideStyles.thumbIconStyles}
        title={title.toUpperCase()}
        thumbIconBackgroundColor="transparent"
        thumbIconBorderColor="transparent"
        thumbIconHeight={50}
        thumbIconWidth={60}
      />
    </View>
  );
};

export default RiderActionButton;
