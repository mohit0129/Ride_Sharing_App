import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { FC } from "react";
import CustomText from "../shared/CustomText";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Colors } from "@/utils/Constants";

interface CounterBtnProps {
  title: string;
  onPress: () => void;
  initialCount: number;
  onCountdownEnd?: () => void;
}

const CounterButton: FC<CounterBtnProps> = ({
  initialCount,
  onCountdownEnd,
  onPress,
  title,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <CustomText fontFamily="SemiBold" fontSize={12} style={styles.text}>
        {title}
      </CustomText>
      <View style={styles.counter}>
        <CountdownCircleTimer
          onComplete={onCountdownEnd}
          isPlaying
          duration={initialCount}
          size={30}
          strokeWidth={3}
          colors={["#87F700", "#01F2CB", "#008CFF", "#f74810", "#a53000"]}
          colorsTime={[10,8,6,4,0]}
        >
          {({ remainingTime }) => (
            <CustomText style={styles.text} fontFamily="SemiBold" fontSize={10}>
              {remainingTime}
            </CustomText>
          )}
        </CountdownCircleTimer>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    paddingVertical : 8,
    paddingHorizontal : 12
  },
  counter: {
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  text: {
    color: "#444",
    marginRight: 10,
  },
});

export default CounterButton;
