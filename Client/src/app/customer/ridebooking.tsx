import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useUserStore } from "@/store/userStore";
import { rideStyles } from "@/styles/rideStyles";
import { StatusBar } from "expo-status-bar";
import { calculateEstimateDropTime, calculateFare } from "@/utils/mapUtils";
import RoutesMap from "@/components/customer/RoutesMap";
import CustomText from "@/components/shared/CustomText";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { router } from "expo-router";
import { commonStyles } from "@/styles/commonStyles";
import CustomButton from "@/components/shared/CustomButton";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import { createRide } from "@/service/rideService";

const RideBooking = () => {
  const route = useRoute();
  const item = route.params as any;
  const { location } = useUserStore() as any;
  const [selectedOption, setSelectedOption] = useState("Bike");
  const [loading, setLoading] = useState(false);


  const farePrices = useMemo(
    () => calculateFare(parseFloat(item?.distanceInKm)),
    [item?.distanceInKm]
  );
  const dropTimes = useMemo(()=> calculateEstimateDropTime(parseFloat(item?.distanceInKm)) ,[item?.distanceInKm])

  const rideOptions:any = useMemo(() => {
     return [
      {
        type: "Bike",
        seats: 1,
        time: dropTimes?.bike?.etaTime,
        dropTime: dropTimes?.bike?.dropTime,
        price: farePrices?.bike,
        isFasted: true,
        icon: require("@/assets/icons/bike.png"),
      },
      {
        type: "Auto",
        seats: 3,
        time: dropTimes?.auto?.etaTime,
        dropTime: dropTimes?.auto?.dropTime,
        price: farePrices.auto,
        icon: require("@/assets/icons/auto.png"),
      },
      {
        type: "Cab Economy",
        seats: 4,
        time: dropTimes?.cabEconomy?.etaTime,
        dropTime: dropTimes?.cabEconomy?.dropTime,
        price: farePrices.cabEconomy,
        icon: require("@/assets/icons/cab.png"),
      },
      {
        type: "Cab Premium",
        seats: 4,
        time: dropTimes?.cabPremium?.etaTime,
        dropTime: dropTimes?.cabPremium?.dropTime,
        price: farePrices.cabPremium,
        icon: require("@/assets/icons/cab_premium.png"),
      },
    ];
  }, [farePrices]);

  const handleOptionSelect = useCallback((type: string) => {
    setSelectedOption(type);
  }, []);

  const handleRideBooking = async () => {
    setLoading(true);
    await createRide({
      vehicle : selectedOption === "Cab Economy" ?
      'cabEconomy' : selectedOption === "Cab Premium" ?
      'cabPremium' : selectedOption === "Bike" ? 'bike' : 'auto',
      drop : {
        latitude : parseFloat(item?.drop_latitude),
        longitude : parseFloat(item?.drop_longitude),
        address : item?.drop_address
      },
      pickup : {
        latitude : parseFloat(location?.latitude),
        longitude : parseFloat(location?.longitude),
        address : location?.address
      }
    });
    setLoading(false);
  };

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="#FF9001" translucent={false} />

      {item?.drop_latitude && location?.latitude && (
        <RoutesMap
          drop={{
            latitude: parseFloat(item?.drop_latitude),
            longitude: parseFloat(item?.drop_longitude),
          }}
          pickup={{
            latitude: parseFloat(location?.latitude),
            longitude: parseFloat(location?.longitude),
          }}
        />
      )}

      <View style={rideStyles.rideSelectionContainer}>
        <View style={rideStyles.offerContainer}>
          <CustomText variant="h7">
            You get ₹10 off & 5 coins cashback!
          </CustomText>
        </View>

        <ScrollView
          contentContainerStyle={rideStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {rideOptions?.map((ride: any, index: number) => (
            <RideOption
              key={index}
              ride={ride}
              selected={selectedOption}
              onSelect={handleOptionSelect}
            />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[rideStyles.backButton]}
        onPress={() => router.back()}
      >
        <MaterialIcons
          name="arrow-back-ios-new"
          size={RFValue(15)}
          color="#000"
        />
      </TouchableOpacity>

      <View style={rideStyles.bookingContainer}>
        <View style={[commonStyles.flexRowBetween,{paddingVertical : 8}]}>
          <View
            style={[
              rideStyles.couponContainer,
              { borderRightWidth: 1, borderRightColor: "#ccc" },
            ]}
          >
            <Image
              source={require("@/assets/icons/rupee.png")}
              style={rideStyles.icon}
            />
            <View>
              <CustomText fontFamily="Medium" fontSize={12}>
                Cash
              </CustomText>
              <CustomText
                fontFamily="Medium"
                fontSize={10}
                style={{ opacity: 0.7 }}
              >
                Far : {item?.distanceInKm} KM
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(14)} color="#333" />
          </View>

          <View
            style={[
              rideStyles.couponContainer,
            ]}
          >
            <Image
              source={require("@/assets/icons/coupon.png")}
              style={rideStyles.icon}
            />
            <View>
              <CustomText fontFamily="Medium" fontSize={12}>
                RIDEEASE10
              </CustomText>
              <CustomText
                fontFamily="Medium"
                fontSize={10}
                style={{ opacity: 0.7 }}
              >
                Coupon Applied
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(14)} color="#333" />
          </View>
        </View>


        <CustomButton
          title="Book Ride"
          disabled={loading}
          loading={loading}
          onPress={handleRideBooking}
        />
      </View>
    </View>
  );
};

const RideOption = memo(({ ride, selected, onSelect }: any) => (
  <TouchableOpacity
    onPress={() => onSelect(ride?.type)}
    style={[
      rideStyles.rideOption,
      { borderColor: selected === ride.type ? "#FF9001" : "#ddd" },
    ]}
  >
    <View style={commonStyles.flexRowBetween}>
      <Image source={ride?.icon} style={rideStyles.rideIcon} />
      <View style={rideStyles.rideDetails}>
        <CustomText fontFamily="Medium" fontSize={12}>
          {ride?.type}
          {ride?.isFasted && (
            <Text style={rideStyles.fastestLabel}>  FASTEST</Text>
          )}
        </CustomText>
        <CustomText fontFamily="Regular" fontSize={10}>
          {ride?.seats} seats ◉ {ride?.time} away ◉ Drop {ride?.dropTime}
        </CustomText>
      </View>

      <View style={rideStyles.priceContainer}>
        <CustomText fontFamily="SemiBold" fontSize={14}>
          ₹{ride?.price?.toFixed(2)}
        </CustomText>
        {selected === ride.type && (
          <Text style={rideStyles.discountedPrice}>
            ₹{Number(ride?.price + 10).toFixed(2)}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export default RideBooking;
