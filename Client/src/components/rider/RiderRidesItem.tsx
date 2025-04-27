import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import { useRiderStore } from "@/store/riderStore";
import { acceptRideOffer } from "@/service/rideService";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { orderStyles } from "@/styles/riderStyles";
import { commonStyles } from "@/styles/commonStyles";
import { calculateDistance, vehicleIcons } from "@/utils/mapUtils";
import CustomText from "../shared/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CounterButton from "./CounterButton";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
  _id: string;
  vehicle?: VehicleType;
  pickup: { address: string; latitude: number; longitude: number };
  drop?: { address: string; latitude: number; longitude: number };
  fare?: number;
  distance: number;
}

const RiderRidesItem: FC<{ item: RideItem; removeIt?: () => void }> = ({
  item,
  removeIt,
}) => {
  const { location } = useRiderStore();
  const acceptRide = async () => {
    acceptRideOffer(item?._id);
  };

  return (
    <Animated.View
      entering={FadeInLeft.duration(500)}
      exiting={FadeOutRight.duration(500)}
      style={orderStyles.container}
    >
      <View style={commonStyles.flexRowBetween}>
        <View style={commonStyles.flexRow}>
          {item.vehicle && (
            <Image
              source={vehicleIcons![item.vehicle]?.icon}
              style={orderStyles.rideIcon}
            />
          )}
          <CustomText
            fontFamily="SemiBold"
            fontSize={11}
            style={{ textTransform: "capitalize" }}
          >
            {item.vehicle}
          </CustomText>
        </View>

        <CustomText
          fontSize={11}
          fontFamily="SemiBold"
          style={{ opacity: 0.7 }}
        >
          {" "}
          #RID{item._id.slice(0, 5).toUpperCase()}
        </CustomText>
      </View>

      <View style={orderStyles.locationsContainer}>
        <View style={orderStyles.flexRowBase}>
          <View>
            <View style={orderStyles.pickupHollowCircle} />
            <View style={orderStyles.continuousLine} />
          </View>
          <View style={orderStyles.infoText}>
            <CustomText fontFamily="SemiBold" numberOfLines={1} fontSize={11}>
              {item?.pickup?.address?.slice(0, 10)}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontFamily="Medium"
              fontSize={9.5}
              style={orderStyles.label}
            >
              {item?.pickup?.address}
            </CustomText>
          </View>
        </View>
        <View style={orderStyles.flexRowBase}>
          <View>
            <View style={orderStyles.dropHollowCircle} />
          </View>
          <View style={orderStyles.infoText}>
            <CustomText fontFamily="SemiBold" numberOfLines={1} fontSize={11}>
              {item?.drop?.address?.slice(0, 10)}
            </CustomText>
            <CustomText
              numberOfLines={2}
              fontFamily="Medium"
              fontSize={9.5}
              style={orderStyles.label}
            >
              {item?.drop?.address}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={commonStyles.flexRowBetween}>
        <View style={[commonStyles.flexRowGap]}>
          <View>
            <CustomText
              fontFamily="Medium"
              fontSize={9}
              style={orderStyles.label}
            >
              Pickup
            </CustomText>

            <CustomText fontFamily="SemiBold" fontSize={11}>
              {(location &&
                calculateDistance(
                  item?.pickup?.latitude,
                  item?.pickup?.longitude,
                  location?.latitude,
                  location?.longitude
                ).toFixed(2)) ||
                "-----"}{" "}
              KM
            </CustomText>
          </View>
          <View style={orderStyles.borderLine}>
            <CustomText
              fontFamily="Medium"
              fontSize={9}
              style={orderStyles.label}
            >
              Drop
            </CustomText>

            <CustomText fontFamily="SemiBold" fontSize={11}>
              {item?.distance.toFixed(2)} KM
            </CustomText>
          </View>
        </View>
        <View style={orderStyles.flexRowEnd}>
          <TouchableOpacity>
            <Ionicons name="close-circle" size={RFValue(24)} color="#000" />
          </TouchableOpacity>

          <CounterButton
            initialCount={30}
            title="ACCEPT"
            onCountdownEnd={removeIt}
            onPress={acceptRide}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default RiderRidesItem;
