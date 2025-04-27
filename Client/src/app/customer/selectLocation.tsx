import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "@/components/shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";
import { Colors } from "@/utils/Constants";
import { uiStyles } from "@/styles/uiStyles";
import LocationInput from "@/components/customer/LocationInput";
import { useUserStore } from "@/store/userStore";
import {
  calculateDistance,
  getLatLong,
  getPlacesSuggestions,
} from "@/utils/mapUtils";
import { locationStyles } from "@/styles/locationStyles";
import LocationItem from "@/components/customer/LocationItem";
import MapPickerModal from "@/components/customer/MapPickerModal";

const LocationSelection = () => {
  const { location, setLocation } = useUserStore();
  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropCoords, setDropCoords] = useState<any>(null);
  const [drop, setDrop] = useState("");
  const [locations, setLocations] = useState([]);
  const [focusedInput, setFocusedInput] = useState("drop");
  const [modalTitle, setModalTitle] = useState("drop");
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  const fetchLocation = async (query: string) => {
    if (query?.length > 4) {
      const data = await getPlacesSuggestions(query);
      setLocations(data);
    }
  };

  const addLocation = async (id: string) => {
    const data = await getLatLong(id);
    if (data) {
      if (focusedInput === "drop") {
        setDrop(data?.address);
        setDropCoords(data);
      } else {
        setLocation(data);
        setPickupCoords(data);
        setPickup(data?.address);
      }
    }
  };

  const renderLocations = ({ item }: any) => {
    return (
      <LocationItem item={item} onPress={() => addLocation(item?.place_id)} />
    );
  };

  const checkDistance = async () => {
    if (!pickupCoords || !dropCoords) return;

    const { latitude: lat1, longitude: lon1 } = pickupCoords;
    const { latitude: lat2, longitude: lon2 } = dropCoords;

    if (lat1 === lat2 && lon1 === lon2) {
      Alert.alert(
        "Pickup and drop locations cannot be same.","Please select different Location."
      );
      return;
    }

    const distance = calculateDistance(lat1, lon1, lat2, lon2);

    const minDistance = 0.5;
    const maxDistance = 50;

    if (distance < minDistance) {
      Alert.alert(
        "The selected location are too close",
        "Please choose location that are further apart"
      );
    } else if (distance > maxDistance) {
      Alert.alert(
        "The selected location are too far apart",
        "Please select location a closer drop location."
      );
    } else {
      setLocations([]);
      router.navigate({
        pathname : "/customer/ridebooking",
        params : {
          distanceInKm : distance.toFixed(2),
          drop_latitude : dropCoords?.latitude,
          drop_longitude : dropCoords?.longitude,
          drop_address : drop,
        }
      });
      console.log(`Distance is valid : ${distance.toFixed(2)}`)
    }
  };

  useEffect(() => {
    if (dropCoords && pickupCoords) {
      checkDistance();
    } else {
      setLocations([]);
      setMapModalVisible(false);
    }
  }, [dropCoords, pickupCoords]);

  useEffect(()=>{
    if(location){
      setPickupCoords(location);
      setPickup(location.address);
    }
  },[location])

  return (
    <View style={homeStyles.container}>
      <StatusBar style="dark" backgroundColor="#fff" translucent={false} />
      <SafeAreaView />
      <TouchableOpacity
        style={[commonStyles.flexRow, { marginTop: 6 }]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.iosColor} />
        <CustomText fontFamily="Regular" style={{ color: Colors.iosColor }}>
          Back
        </CustomText>
      </TouchableOpacity>

      <View style={uiStyles.locationInputs}>
        <View style={[styles.dottedBar]} />
        <LocationInput
          placeholder="Search Pickup Location"
          type="pickup"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text);
            fetchLocation(text);
          }}
          onFocus={() => setFocusedInput("pickup")}
          onClear={()=>setPickup("")}
        />

        <LocationInput
          placeholder="Search drop Location"
          type="drop"
          value={drop}
          onChangeText={(text) => {
            setDrop(text);
            fetchLocation(text);
          }}
          onFocus={() => setFocusedInput("drop")}
          onClear={()=> setDrop("")}
        />
        <CustomText
          fontFamily="Medium"
          variant="h7"
          style={uiStyles.suggestionText}
        >
          {focusedInput} Suggestions
        </CustomText>
      </View>

      <FlatList
        data={locations}
        renderItem={renderLocations}
        keyExtractor={(item: any) => item?.place_id}
        initialNumToRender={5}
        windowSize={5}
        ListFooterComponent={
          <TouchableOpacity
            onPress={() => {
              setModalTitle(focusedInput);
              setMapModalVisible(true);
            }}
            style={[commonStyles.flexRow, locationStyles.container]}
          >
            <View style={uiStyles.mapPinIconContainer}>
            <Image
              source={require("@/assets/icons/map_pin.png")}
              style={[uiStyles.mapPinIcon,{marginLeft : 10}]}
            />
            </View>
            <CustomText fontFamily="Medium" fontSize={12}>
              Select from Map
            </CustomText>
          </TouchableOpacity>
        }
      />

      {isMapModalVisible && (
        <MapPickerModal
          selectedLocation={{
            latitude:
              focusedInput === "drop"
                ? dropCoords?.latitude
                : pickupCoords?.latitude,
            longitude:
              focusedInput === "drop"
                ? dropCoords?.longitude
                : pickupCoords?.longitude,
            address: focusedInput === "drop" ? drop : pickup,
          }}
          title={modalTitle}
          visible={isMapModalVisible}
          onClose={() => setMapModalVisible(false)}
          onSelectLocation={(data: any) => {
            if (data) {
              if (modalTitle === "drop") {
                setDropCoords(data);
                setDrop(data?.address);
              } else {
                setLocation(data);
                setPickupCoords(data);
                setPickup(data?.address);
              }
            }
          }}
        />
      )}
    </View>
  );
};

export default LocationSelection;

const styles = StyleSheet.create({
  dottedBar: {
    width: 0,
    height: 54,
    borderLeftWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dotted",
    position: "absolute",
    top: 51,
    left: 28,
    zIndex: 3,
  },
});
