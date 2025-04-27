import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { FC } from "react";
import { commonStyles } from "@/styles/commonStyles";
import { locationStyles } from "@/styles/locationStyles";
import { uiStyles } from "@/styles/uiStyles";
import CustomText from "../shared/CustomText";
import { Ionicons } from "@expo/vector-icons";

const LocationItem: FC<{ item: any; onPress: () => void }> = ({
  item,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[commonStyles.flexRowBetween, locationStyles.container]}
      onPress={onPress}
    >
      <View style={commonStyles.flexRow}>
        <Image
          source={require("@/assets/icons/map_pin.png")}
          style={uiStyles.mapPinIcon}
        />
        <View style={{ width: "85%" }}>
          <CustomText fontFamily="Medium" numberOfLines={1} fontSize={12}>
            {item?.title}
          </CustomText>
          <CustomText
            fontFamily="Regular"
            numberOfLines={1}
            style={{ opacity: 0.7, marginTop : 2}}
            fontSize={10}
          >
            {item?.description}
          </CustomText>
        </View>
        <Ionicons name="heart-outline" size={20} color='#555' />
      </View>
    </TouchableOpacity>
  );
};

export default LocationItem;
