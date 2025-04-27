
import {MMKV} from  'react-native-mmkv'

export const tokenStorage = new MMKV({
    id : 'tokenStorage',
    encryptionKey : 'tokensecretfortokenstorage'
})

export const storage = new MMKV({ 
    id  : 'ride_ease_storage',
    encryptionKey : 'iloveriding'
});

export const mmkvStorage = {
    setItem : (key : string, value : string) => {
        storage.set(key,value)
    },
    getItem : (key:string) => {
        const value = storage.getString(key);
        return value ?? null;
    },
    removeItem : (key : string) => {
        storage.delete(key);
    }
}
