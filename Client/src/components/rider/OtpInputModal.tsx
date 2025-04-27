import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import { modalStyles } from "@/styles/modalStyles";
import { TextInput } from "react-native-gesture-handler";

interface OtpInputModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (otp: string) => void;
}

const OtpInputModal: FC<OtpInputModalProps> = ({
  onClose,
  onConfirm,
  title,
  visible,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<Array<any>>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < inputs.current.length - 1) {
        inputs.current[index + 1].focus();
      }

      if (!value && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleConfirm = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      onConfirm(otpValue);
    } else {
      Alert.alert("Please Enter a 4 digit OTP.");
    }
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <Text style={modalStyles.centerText}>{title}</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default OtpInputModal;

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#777",
    textAlign: "center",
    fontSize: 18,
    borderRadius: 10,
    fontFamily: "SemiBold",
  },
  confirmButton: {
    backgroundColor: "#0DFF00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    margin: 20,
  },
  confirmButtonText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Medium",
  },
});
