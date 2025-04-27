import { Platform, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import LocationBar from "@/components/customer/LocationBar";
import { screenHeight } from "@/utils/Constants";
import DraggableMap from "@/components/customer/DraggableMap";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SheetContent from "@/components/customer/SheetContent";
import { getMyRides } from "@/service/rideService";

const androidHeights = [screenHeight * 0.16, screenHeight * 0.46, screenHeight * 0.80];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5];
const CustomerHome = () => {
  const bottomSheetRef = useRef(null);
  const snapPoint = useMemo(
    () => (Platform.OS === "ios" ? iosHeights : androidHeights),
    []
  );

  const [mapHeight, setMapHeight] = useState(snapPoint[0]);
  const handleSheetChanges = useCallback((index: number) => {
    let height = screenHeight * 0.7;
    if (index === 1) {
      height = screenHeight * 0.4;
    }
    setMapHeight(height);
  }, []);

  useEffect(()=>{
    getMyRides();
  },[])

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="#FF9001" translucent={false} />
      <LocationBar />

      <DraggableMap height={mapHeight} />

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        handleIndicatorStyle={{ backgroundColor: "#999" ,}}
        enableOverDrag={false}
        enableDynamicSizing={false}
        style={{zIndex : 5}}
        snapPoints={snapPoint}
        onChange={handleSheetChanges}
        backgroundStyle={{
          elevation : 9,
          shadowColor : '#000',
          shadowOffset : {height : 1,width : 1},
          shadowOpacity : 0.8,
          shadowRadius : 10
        }}
      >
        <BottomSheetScrollView
          contentContainerStyle={homeStyles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <SheetContent />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default CustomerHome;
