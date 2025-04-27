import { View, Text, TextInputProps, StyleSheet } from "react-native";
import React, { FC } from "react";
import { TextInput } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";

interface LocationInputProps extends TextInputProps {
  placeholder: string;
  type: "pickup" | "drop";
  value: string;
  onChangeText: (text: string) => void;
  onClear : () => void;
}

const LocationInput: FC<LocationInputProps> = ({
  onChangeText,
  placeholder,
  type,
  value,
  onClear,
  ...props
}) => {
  const dotColor = type === "pickup" ? "green" : "red";

  return (
    <View
      style={[
        styles.container,
        styles.focusContainer,
        { backgroundColor: value == "" ? "#fff" : "#f2f2f2" },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: value == "" ? "#fff" : "#f2f2f2" },
        ]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        onChangeText={onChangeText}
        value={value}
        {...props}
      />
      {value.length > 1 && <Ionicons
        name="close-circle-outline"
        size={RFValue(15)}
        color="#555"
        onPress={onClear}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginVertical: 7,
  },
  focusContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  input: {
    height: 45,
    width: "90%",
    color: "#222",
    fontSize: RFValue(10),
    fontFamily: "Regular",
  },
});

export default LocationInput;
