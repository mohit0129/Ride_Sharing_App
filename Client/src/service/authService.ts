import { useRiderStore } from "@/store/riderStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore"
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";

export const signin = async (
    payload : {
        role : "customer" | "rider";
        phone : string;
    },
    updateAccessToken : () => void
) => {
    const {setUser} = useUserStore.getState();
    const {setUser : setRiderUser} = useRiderStore.getState();

    try {

        const res = await axios.post(`${BASE_URL}/auth/signin`,payload);
        if(res.data.user.role === 'customer'){
            setUser(res.data.user);
        }else {
            setRiderUser(res.data.user);
        }

        tokenStorage.set("access_token",res.data.access_token);
        tokenStorage.set("refresh_token",res.data.refresh_token);

        if(res.data.user.role === 'customer'){
            resetAndNavigate('/customer/home');
        }else {
            resetAndNavigate("/rider/home")
        }

        updateAccessToken();
        
    } catch (error:any) {
        console.error("Error : ",error?.response?.data?.msg || "Error signin");
        Alert.alert("Oops! There was an error!");
    }
}

export const logout = async (disconnect?: () => void) => {

    if(disconnect){
        disconnect();
    }

    const {clearData } = useUserStore.getState();
    const { clearRiderData} = useRiderStore.getState();

    tokenStorage.clearAll();
    clearRiderData();
    clearData();
    resetAndNavigate("/role");
}