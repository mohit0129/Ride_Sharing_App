import axios from "axios";
import { BASE_URL } from "./config";
import {tokenStorage} from '@/store/storage'
import { logout } from "./authService";


export const refreshToken = async () => {
    try {
       const refresh_token = tokenStorage.getString("refresh_token");
       const res = await axios.post(`${BASE_URL}/auth/refresh-token`,{
        refresh_token
       });

       const new_access_token = res.data.access_token;
       const new_refresh_token = res.data.refresh_token;

       tokenStorage.set("access_token",new_access_token);
       tokenStorage.set("refresh_token",new_refresh_token);

       return new_access_token;

    } catch (error) {
        console.log('Refresh Token Error!!');
        tokenStorage.clearAll();
        logout();
    }
}


export const appAxios = axios.create({
    baseURL : BASE_URL,
});


appAxios.interceptors.request.use(async config => {
    const accessToken = tokenStorage.getString('access_token');
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
});


appAxios.interceptors.response.use(
    response => response,
    async error => {
        if(error.response && error.response.status === 401){
            try {
                const newAccessToken = await refreshToken();
                if(newAccessToken){
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(error.config);
                }
            } catch (error) {
                console.log('Error refreshing token!'); 
            }
        }
        return Promise.reject(error);
    }
)