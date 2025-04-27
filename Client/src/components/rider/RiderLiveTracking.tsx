import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import CustomText from "../shared/CustomText";
import { mapStyles } from "@/styles/mapStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { getPoints } from "@/utils/mapUtils";
import { Colors } from "@/utils/Constants";
import MapViewDirections from "react-native-maps-directions";

const apikey = process.env.EXPO_PUBLIC_MAP_API_KEY || "";

const RiderLiveTracking: FC<{
  drop: any;
  pickup: any;
  rider: any;
  status: any;
}> = ({ drop, pickup, rider, status }) => {
  const mapRef = useRef<MapView>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const fitToMarkers = async () => {
    if (isUserInteracting) return;

    const coordinates = [];
    if (pickup?.latitude && pickup?.longitude && status === "START") {
      coordinates.push({
        latitude: pickup?.latitude,
        longitude: pickup?.longitude,
      });
    }
    if (drop?.latitude && drop?.longitude && status === "ARRIVED") {
      coordinates.push({
        latitude: drop?.latitude,
        longitude: drop?.longitude,
      });
    }

    if (rider?.latitude && rider?.longitude) {
      coordinates.push({
        latitude: rider.latitude,
        longitude: rider.longitude,
      });
    }

    if (coordinates.length === 0) return;

    try {
      mapRef.current?.fitToCoordinates(coordinates, {
        animated: true,
        edgePadding: { bottom: 50, left: 50, right: 50, top: 50 },
      });
    } catch (error) {
      console.error("Error fit to marker ", error);
    }
  };

  const fitToMarkersWithDelay = () => {
    setTimeout(() => {
      fitToMarkers();
    }, 500);
  };

  const calculateInitialRegion = () => {
    if (pickup?.latitude && drop?.latitude) {
      const latitude = (pickup?.latitude + drop?.latitude) / 2;
      const longitude = (pickup?.longitude + drop?.longitude) / 2;
      return {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return indiaIntialRegion;
  };

  useEffect(() => {
    if (pickup?.latitude && drop?.latitude) {
      fitToMarkers();
    }
  }, [drop?.latitude, pickup?.latitude, rider?.latitude]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        followsUserLocation
        style={{ flex: 1 }}
        initialRegion={calculateInitialRegion()}
        provider="google"
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        onRegionChange={() => setIsUserInteracting(true)}
        onRegionChangeComplete={() => setIsUserInteracting(false)}
      >
        {rider?.latitude && pickup?.latitude && (
          <MapViewDirections
            origin={status === 'START' ? pickup : rider}
            destination={status === "START" ? pickup : rider}
            onReady={fitToMarkersWithDelay}
            apikey={apikey}
            strokeColor={Colors.primary}
            strokeColors={[Colors.primary]}
            strokeWidth={5}
            precision="high"
            onError={(err) => console.log("Directions error : ", err)}
          />
        )}

        {drop?.latitude && (
          <Marker
            coordinate={{
              latitude: drop?.latitude,
              longitude: drop?.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/drop_marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}
        {pickup?.latitude && (
          <Marker
            coordinate={{
              latitude: pickup?.latitude,
              longitude: pickup?.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {rider?.latitude && (
          <Marker
            coordinate={{
              latitude: rider?.latitude,
              longitude: rider?.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/cab_marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {drop && pickup && (
          <Polyline
            coordinates={getPoints([drop, pickup])}
            strokeColor={Colors.primary}
            strokeWidth={4}
            geodesic={true}
            lineDashPattern={[12, 10]}
          />
        )}
      </MapView>

      <TouchableOpacity style={mapStyles.gpsLiveButton} onPress={() => {}}>
        <CustomText fontFamily="SemiBold" fontSize={10}>
          Open Live GPS
        </CustomText>
        <MaterialCommunityIcons
          name="location-enter"
          size={RFValue(12)}
          color="#000"
        />
      </TouchableOpacity>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#ff9001"
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(RiderLiveTracking);
