import { router } from "expo-router";
import { appAxios } from "./apiInterceptors";
import { Alert } from "react-native";
import { resetAndNavigate } from "@/utils/Helpers";

interface coords {
  latitude: number;
  longitude: number;
  address: string;
}

export const createRide = async (payload: {
  vehicle: "cabEconomy" | "cabPremium" | "bike" | "auto";
  pickup: coords;
  drop: coords;
}) => {
  try {
    const res = await appAxios.post("/ride/create", payload);
    
    if(res.data.success){
      router?.navigate({
        pathname: "/customer/liveride",
        params: { id: res.data?.ride?._id },
      });
    }
    
  } catch (error) {
    Alert.alert("Oops!", "Unable to create ride. Please try again later.");
    console.log("Error creating ride", error);
  }
};

export const getMyRides = async (isCustomer: boolean = true) => {
  try {
    const res = await appAxios.get("/ride/rides");
    const filterRides = res.data.rides?.filter(
      (ride: any) => ride?.status != "COMPLETED"
    );
    if (filterRides?.length > 0) {
      router?.navigate({
        pathname: isCustomer ? "/customer/liveride" : "/rider/liveride",
        params: { id: filterRides[0]?._id },
      });
    }
  } catch (error) {
    Alert.alert("Oops!", "There was an error, Please try again later.");
    console.log("Error from get my ride : ", error);
  }
};

export const acceptRideOffer = async (rideId: string) => {
  try {
    const res = await appAxios.patch(`/ride/accept/${rideId}`);

    resetAndNavigate({ pathname: "/rider/liveride", params: { id: rideId } });
  } catch (error) {
    Alert.alert("Oops!", "There was an error, Please try again later.");
    console.log("Accepting error ", error);
  }
};

export const updateRideStatus = async (rideId: string, status: string) => {
  try {
    const res = await appAxios.patch(`/ride/update/${rideId}`, {
      status: status,
    });
    return true;
  } catch (error) {
    Alert.alert("Oops!", "There was an error, Please try again later.");
    console.log("Update status error ", error);
    return false;
  }
};

export const cancelRide = async (rideId: string) => {
  try {
    const res = await appAxios.patch(`/ride/cancel/${rideId}`);
    resetAndNavigate('/customer/home');
    return true;
  } catch (error) {
    Alert.alert("Oops!", "There was an error cancelling your ride. Please try again.");
    console.log("Cancel ride error ", error);
    return false;
  }
};
