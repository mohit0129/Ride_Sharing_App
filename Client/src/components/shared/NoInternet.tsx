import {
  View,
  Text,
  AppState,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import CustomText from "./CustomText";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/utils/Constants";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import NetInfo from "@react-native-community/netinfo";
import { commonStyles } from "@/styles/commonStyles";

const NoInternet: FC = () => {
  const [isConnected, setIsConnected] = useState<any>(true);

  const onNetworkStateChange = (newState: any) => {
    setIsConnected(newState.isConnected && newState.isInternetReachable);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const unsubscribe = NetInfo.addEventListener(onNetworkStateChange);  
      return () => {
        unsubscribe();
      };
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    }
  }, []);

  return (
    <Modal transparent animationType="slide" visible={!isConnected}>
      <StatusBar
        style="light"
        backgroundColor="rgba(0, 0, 0, 0.32)"
        translucent={false}
      />
      <View style={styles.overlay}>
        <View style={styles.container}>
          <MaterialIcons
            name="wifi-off"
            size={RFValue(40)}
            style={{ color: "#666" }}
          />
          <CustomText fontFamily="Bold" fontSize={18} style={styles.title}>
            No Internet or Unstable Connection
          </CustomText>
          <CustomText fontSize={14} fontFamily="Medium" style={styles.message}>
            Please check your network settings.
          </CustomText>

          <View style={commonStyles.flexRowGap}>
            <TouchableOpacity
              style={styles.btnClose}
              onPress={()=>setIsConnected(true)}
            >
              <CustomText
                style={{ color: "#555" }}
                fontFamily="SemiBold"
                fontSize={15}
              >
                Close
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onNetworkStateChange}>
              <CustomText
                style={styles.btnText}
                fontFamily="SemiBold"
                fontSize={15}
              >
                Retry
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.32)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    color: "#444",
    textAlign: "center",
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  btnClose: {
    marginTop: 20,
    backgroundColor: "#f3f3f4",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  btnText: {
    color: "#fff",
  },
});

export default NoInternet;
