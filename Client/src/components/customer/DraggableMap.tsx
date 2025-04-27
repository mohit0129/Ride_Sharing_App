import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC, memo, useCallback, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useUserStore } from "@/store/userStore";
import { useWS } from "@/service/WSProvider";
import MapView, { Marker, Region } from "react-native-maps";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { reverseGeocode } from "@/utils/mapUtils";
import haversine from "haversine-distance";
import { mapStyles } from "@/styles/mapStyles";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from "expo-location";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
  const isFocused = useIsFocused();
  const [markers, setMarkers] = useState<any>([]);
  const mapRef = useRef<MapView>(null);
  const { location, setLocation, outOfRange, setOutOfRange } = useUserStore();
  const { emit, on, off } = useWS();
  const MAX_DISTANCE_THRESHOLD = 10000;

  useEffect(() => {
    (async () => {
      if (isFocused) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            };
            handleRegionChangeComplete(newRegion);
          } catch (error) {
            console.error("Error getting current location : ", error);
          }
        } else {
          console.log("Permission to access loaction denied!");
        }
      }
    })();
  }, [mapRef, isFocused]);

  //REALTIME NEARBY RIDERS
  useEffect(()=> {
    if(location?.latitude && location?.longitude && isFocused){
      emit('subscribeToZone',{
        latitude : location.latitude,
        longitude : location.longitude,
      });
      on('nearbyriders',(riders : any[])=> {
        const updatedMarkers = riders.map((rider)=> (
          {
            id : rider.id,
            latitude : rider.coords.latitude,
            longitude : rider.coords.longitude,
            type : 'rider',
            rotation : rider.coords.heading,
            visible : true
          }
        ));
        setMarkers(updatedMarkers);
      })
    }

    return () => {
      off("nearbyriders");
    }
  },[location,emit,on,off,isFocused])

  //SIMULATING NEARBY RIDERS start
  // const generateRandomMarkers = useCallback(() => {
  //   if (!location?.latitude || !location.longitude || outOfRange) return;
  //   const types = ["bike", "auto", "cab"];
  //   const newMarkers = Array.from({ length: 20 }, (_, index) => {
  //     const randomType = types[Math.floor(Math.random() * types.length)];
  //     const randomRotation = Math.floor(Math.random() * 360);

  //     return {
  //       id: index,
  //       latitude: location?.latitude + (Math.random() - 0.5) * 0.01,
  //       longitude: location?.longitude + (Math.random() - 0.5) * 0.01,
  //       type: randomType,
  //       rotation: randomRotation,
  //       visible: true,
  //     };
  //   });
  //   setMarkers(newMarkers);
  // },[location]);
  
  // useEffect(() => {
  //   generateRandomMarkers();
  // }, [location]);
  //end
  

  const handleRegionChangeComplete = async (newRegion: Region) => {
    const address = await reverseGeocode(
      newRegion.latitude,
      newRegion.longitude
    );
    setLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      address: address,
    });
    const userLocation = {
      latitude: location?.latitude,
      longitude: location?.longitude,
    } as any;

    if (userLocation) {
      const newLocation = {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      };
      const distance = haversine(userLocation, newLocation);
      setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
    }
  };

  const handleGpsButtonPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
      const address = await reverseGeocode(latitude, longitude);
      setLocation({ latitude, longitude, address });
    } catch (error) {
      console.error("Error getting location", error);
    }
  };

  return (
    <View style={{ height: height, width: "100%" }}>
      <MapView
        ref={mapRef}
        maxZoomLevel={16}
        minZoomLevel={12}
        pitchEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        style={{ flex: 1 }}
        initialRegion={indiaIntialRegion}
        provider="google"
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
      >
        {markers
          ?.filter(
            (marker: any) =>
              marker?.latitude && marker?.longitude && marker?.visible
          )
          .map((marker: any, index: number) => (
            <Marker
              key={index}
              zIndex={index + 1}
              flat
              anchor={{ x: 0.5, y: 0.5 }}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
            >
              <View
                style={{ transform: [{ rotate: `${marker?.rotation}deg` }] }}
              >
                <Image
                  source={
                    marker.type === "bike"
                      ? require("@/assets/icons/bike_marker.png")
                      : marker.type === "auto"
                      ? require("@/assets/icons/auto_marker.png")
                      : require("@/assets/icons/cab_marker.png")
                  }
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                />
              </View>
            </Marker>
          ))}
      </MapView>

      <View style={mapStyles.centerMarkerContainer}>
        <Image
          source={require("@/assets/icons/marker.png")}
          style={mapStyles.marker}
        />
      </View>
      <TouchableOpacity
        style={mapStyles.gpsButton}
        onPress={handleGpsButtonPress}
      >
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(19)}
          color="#FF9001"
        />
      </TouchableOpacity>

      {outOfRange && (
        <View style={mapStyles.outOfRange}>
          <FontAwesome6 name="road-circle-exclamation" size={24} color="red" />
        </View>
      )}
    </View>
  );
};

export default memo(DraggableMap);

