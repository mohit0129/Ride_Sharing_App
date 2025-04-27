import { View, Text, Platform, ActivityIndicator, Alert } from "react-native";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { screenHeight } from "@/utils/Constants";
import { useWS } from "@/service/WSProvider";
import { StatusBar } from "expo-status-bar";
import { rideStyles } from "@/styles/rideStyles";
import LiveTrackingMap from "@/components/customer/LiveTrackingMap";
import CustomText from "@/components/shared/CustomText";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SearchingRideSheet from "@/components/customer/SearchingRideSheet";
import LiveTrackingSheet from "@/components/customer/LiveTrackingSheet";
import { resetAndNavigate } from "@/utils/Helpers";
import { useRoute } from "@react-navigation/native";

const androidHeights = [screenHeight * 0.22, screenHeight * 0.52];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5];

const LiveRide = () => {
  const route = useRoute();
  const {id} =  route.params as any;
  const {emit,on,off} = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const [riderCoords, setRiderCoords] = useState<any>(null);
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? iosHeights : androidHeights),
    []
  );

  console.log(id);
  

  const [mapHeight, setMapHeight] = useState(snapPoints[0]);

  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.7;
    if (index === 1) {
      height = screenHeight * 0.4;
    }
    setMapHeight(height);
  }, []);



  useEffect(() => {
    
    if(id){
      emit('subscribeRide',id);

      emit('subscribeToZone',riderCoords)

      on('rideData',(data) => {
        setRideData(data);
        if(data?.status === 'SEARCHING_FOR_RIDER'){
          emit('searchrider',id);
        }
      });

      on('rideUpdate', (data) => {
        setRideData(data);
      });

      on('rideCanceled',()=>{
        resetAndNavigate('/customer/home');
        Alert.alert("Ride Cancelled");
      });

      on('error',(error) => {
        resetAndNavigate('/customer/home');
        Alert.alert( error?.message ||"Oops!","No Riders Found!")
      })

    }
  
    return () => {
      off('rideData');
      off('rideUpdate');
      off('rideCanceled');
      off('error');
    }
  }, [id,emit,on,off])

  
 
  useEffect(()=>{
    if(rideData?.rider?._id){
      emit('subscribeToriderLocation',rideData?.rider?._id);
      on('riderLocationUpdate',(data) => {
        setRiderCoords(data?.coords)
      })
    }

    return () => {
      off('riderLocationUpdate');
    }
  },[rideData])

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="#FF9001" translucent={false} />

      {rideData && (
        <LiveTrackingMap
          height={mapHeight}
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            latitude : parseFloat(rideData?.pickup?.latitude),
            longitude : parseFloat(rideData?.pickup?.longitude)
          }}
          rider = {
            riderCoords ? {
              latitude : riderCoords.latitude,
              longitude : riderCoords.longitude,
              heading : riderCoords?.heading
            } : {}
          }
        />
      )}

      {rideData ? (
         <BottomSheet
         ref={bottomSheetRef}
         index={1}
         handleIndicatorStyle={{ backgroundClip: "#ccc" }}
         enableOverDrag={false}
         enableDynamicSizing={false}
         style={{zIndex : 5}}
         snapPoints={snapPoints}
         onChange={handleSheetChanges}
       >
         <BottomSheetScrollView
           contentContainerStyle={rideStyles.container}
           showsVerticalScrollIndicator={false}
         >
          {rideData?.status === 'SEARCHING_FOR_RIDER' ? (
            <SearchingRideSheet item={rideData} />
          ) : (
            <LiveTrackingSheet item={rideData} />
          )}
         </BottomSheetScrollView> 
       </BottomSheet>
      )
      : (
        <View style={{flex : 1,justifyContent : 'center',alignItems : 'center' ,gap : 10}}> 
          <CustomText variant="h8" fontFamily="Regular" >Fetching Information...</CustomText>
          <ActivityIndicator size='small' color='#000' />
        </View>
      )}

    </View>
  );
};

export default memo(LiveRide);
