import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { FC, memo, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { mapStyles } from "@/styles/mapStyles";
import MapViewDirections from "react-native-maps-directions";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/utils/Constants";

const apikey = process.env.EXPO_PUBLIC_MAP_API_KEY || "";

const RoutesMap: FC<{ drop: any; pickup: any }> = ({ drop, pickup }) => {
  const mapRef = useRef<MapView>(null);

  const fitToMarkers = async () => {
    const coordinates = [];
    if (pickup?.latitude && pickup?.longitude) {
      coordinates.push({
        latitude: pickup?.latitude,
        longitude: pickup?.longitude,
      });
    }
    if (drop?.latitude && drop?.longitude) {
      coordinates.push({
        latitude: drop?.latitude,
        longitude: drop?.longitude,
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

  useEffect(() => {
    if (drop?.latitude && pickup?.latitude && mapRef) {
      fitToMarkersWithDelay();
    }
  }, [drop?.latitude, pickup?.latitude, mapRef]);

  const calculateInitialRegion = () => {
    if (pickup?.latitude && drop?.latitude) {
      const latitude = (pickup?.latitude + drop?.latitude) / 2;
      const longitude = pickup?.longitude + drop?.longitude;
      return {
        latitude,
        longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }
    return indiaIntialRegion;
  };

  return (
    <View style={{ flex: 1 }}>
        <StatusBar style="light" backgroundColor="#FF9001" translucent={false} />
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
      >
        {pickup?.latitude && drop?.latitude && (
          <MapViewDirections
            origin={pickup}
            destination={drop}
            apikey={apikey}
            strokeWidth={5}
            precision="high"
            onReady={() => fitToMarkersWithDelay()}
            strokeColor={Colors.primary}
            strokeColors={[Colors.iosColor]}
            onError={(err) => console.log("Directions Error : ", err)}
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
      </MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(18)}
          color="orange"
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(RoutesMap);
