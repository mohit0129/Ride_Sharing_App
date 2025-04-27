import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useRiderStore } from "@/store/riderStore";
import { useWS } from "@/service/WSProvider";
import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { resetAndNavigate } from "@/utils/Helpers";
import { rideStyles } from "@/styles/rideStyles";
import { StatusBar } from "expo-status-bar";
import RiderLiveTracking from "@/components/rider/RiderLiveTracking";
import { updateRideStatus } from "@/service/rideService";
import RiderActionButton from "@/components/rider/RiderActionButton";
import OtpInputModal from "@/components/rider/OtpInputModal";

const LiveRide = () => {
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const { setLocation, location, setOnDuty ,setTodayEarning} = useRiderStore();
  const { emit, on, off } = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const route = useRoute() as any;
  const params = route.params;
  const id = params.id;

  useEffect(() => {
    let locationSubscription: any;
    const startLocationUpdates = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 200,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "SomeWhere",
              heading: heading as number,
            });

            setOnDuty(true);

            emit("goOnDuty", {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              heading: heading as number,
            });

            emit("updateLocation", {
              latitude,
              longitude,
              heading,
            });
            console.log(
              `location updated : Lat : ${latitude} , Lon : ${longitude} , Heading : ${heading} `
            );
          }
        );
      } else {
        console.log("Location Permission denied.");
        Alert.alert(
          "Permission Denied",
          "Location permission is required to go on live duty."
        );
      }
    };

    startLocationUpdates();
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      emit("subscribeRide", id);

      on("rideData", (data) => {
        setRideData(data);
      });
      
      on("rideUpdate", (data) => {
        setRideData(data);
      });

      on("rideCanceled", (error) => {
        console.log("Ride Cancelled Error : ", error);
        resetAndNavigate("/rider/home");
        Alert.alert("Ride Cancelled");
      });

      on("error", (error) => {
        console.log("Ride  Error : ", error);
        resetAndNavigate("/rider/home");
        Alert.alert("Oops!", "There was an error!");
      });
    }

    return () => {
      off("rideData");
      off("error");
    };
  }, [id, emit, on, off]);

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor={`${rideData?.status === "COMPLETED" ? '#0CE800' : '#FF9001'}`} translucent={false} />

      {rideData && (
        <RiderLiveTracking
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData?.pickup?.latitude),
            longitude: parseFloat(rideData?.pickup?.longitude),
          }}
          rider={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            heading: location?.heading,
          }} 
        />
      )}

      <RiderActionButton
        ride={rideData}
        title={
          rideData?.status === "START"
            ? "ARRIVED"
            : rideData?.status === "ARRIVED"
            ? "COMPLETED"
            : "SUCCESS"
        }
        onPress={async () => {
          if (rideData?.status === "START") {
            setOtpModalVisible(true);
            emit('rideAccepted')
            return;
          }
          const isSuccess = await updateRideStatus(rideData?._id, "COMPLETED");
          if (isSuccess) {
            Alert.alert(
              "Congratulations!",
              "You have completed your milestone."
            );
            setTodayEarning(rideData?.fare);
            resetAndNavigate("/rider/home");
          } else {
            Alert.alert(
              "An Error occured",
              "There was an error! Please try again."
            );
          }
        }}
        color="#228b22"
      />

      {isOtpModalVisible && (
        <OtpInputModal
          visible={isOtpModalVisible}
          onClose={() => setOtpModalVisible(false)}
          title="Enter Otp Below"
          onConfirm={async (otp) => {
            if (otp === rideData?.otp) {
              const isSuccess = await updateRideStatus(
                rideData?._id,
                "ARRIVED"
              );
              if (isSuccess) {
                setOtpModalVisible(false);
              } else {
                Alert.alert("Techincal Error!");
              }
            } else {
              Alert.alert("Wrong OTP", "Please enter a Valid OTP.");
            }
          }}
        />
      )}
    </View>
  );
};

export default LiveRide;
