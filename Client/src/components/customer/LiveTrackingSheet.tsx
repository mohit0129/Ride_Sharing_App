import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { FC } from "react";
import { useWS } from "@/service/WSProvider";
import { rideStyles } from "@/styles/rideStyles";
import { commonStyles } from "@/styles/commonStyles";
import CustomText from "../shared/CustomText";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { resetAndNavigate } from "@/utils/Helpers";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
  vehicle?: VehicleType;
  _id: string;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
  otp?: string;
  rider: any;
  status: string;
}

const LiveTrackingSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();

  return (
    <View>
      <View style={rideStyles.headerContainer}>
        <View style={commonStyles.flexRowBetween}>
          {item?.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles.rideIcon}
            />
          )}
          <View style={{ marginLeft: 10 }}>
            <CustomText fontSize={12} fontFamily="Medium">
              {item?.status === "START"
                ? "Rider Near You"
                : item?.status === "ARRIVED"
                ? "HAPPY JOURNEY😊"
                : "Ride Completed ✅"}
            </CustomText>
            <CustomText fontFamily="Bold" fontSize={14}>
              {item.status === "START" ? `OTP - ${item?.otp}` : "----"}
            </CustomText>
          </View>
        </View>

        {item?.rider?.phone && (
          <CustomText fontFamily="SemiBold" fontSize={11} numberOfLines={1}>
            +91
            {item?.rider.phone?.slice(0, 5) +
              " " +
              item?.rider?.phone?.slice(5)}
          </CustomText>
        )}
      </View>

      <View style={{ padding: 10 }}>
        <CustomText fontFamily="SemiBold" fontSize={12}>
          Location Details
        </CustomText>

        <View
          style={[
            commonStyles.flexRowBetween,
            { marginVertical: 15, width: "90%" },
          ]}
        >
          <Image
            source={require("@/assets/icons/marker.png")}
            style={rideStyles.pinIcon}
          />
          <CustomText fontFamily="Regular" numberOfLines={1} fontSize={10}>
            {item?.pickup?.address}
          </CustomText>
        </View>
      <View style={[commonStyles.flexRow, { width: "90%" }]}>
        <Image
          source={require("@/assets/icons/drop_marker.png")}
          style={rideStyles.pinIcon}
        />
        <CustomText fontFamily="Regular" fontSize={10}>
          {item?.drop?.address}
        </CustomText>
      </View>
      </View>


      <View style={{ marginVertical: 20,paddingHorizontal : 15 }}>
        <View style={[commonStyles.flexRowBetween]}>
          <View style={[commonStyles.flexRow]}>
            <MaterialCommunityIcons name="credit-card" size={24} color="#000" />
            <CustomText fontFamily="SemiBold" fontSize={12}>
              Payment
            </CustomText>
          </View>
          <CustomText fontFamily="Bold" fontSize={15}>
            ₹{item?.fare?.toFixed(2)}
          </CustomText>
        </View>

        <CustomText fontSize={10} fontFamily="Regular">
          Payment Via Cash
        </CustomText>
      </View>

      <View style={rideStyles.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles.cancelButton}
          onPress={() => {
            emit("cancelRide", item?._id);
          }}
        >
          <CustomText style={rideStyles.cancelButtonText}>Cancel</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={rideStyles.backButton2}
          onPress={() => {
            if (item.status === "COMPLETED") {
              resetAndNavigate("/customer/home");
              return;
            }
          }}
        >
          <CustomText style={rideStyles.backButtonText}>Back</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveTrackingSheet;
