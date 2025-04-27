import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading: number;
} | null;

// Define types for rider registration process
type PersonalData = {
  firstName: string;
  lastName: string;
  email?: string;
  birthDate: string;
  phone?: string;
};

type VehicleData = {
  vehicleType: string;
  manufacturer: string;
  model: string;
  modelYear: number;
  licensePlate: string;
  color: string;
};

type DocumentData = {
  driverLicense: {
    number: string;
    expiryDate: string;
    images: {
      front: string;
      back: string;
    };
  };
  vehicleRC: {
    number: string;
    expiryDate: string;
    images: {
      front: string;
      back: string;
    };
  };
};

interface RiderStoreProps {
  user: any;
  location: CustomLocation;
  onDuty: boolean;
  todayEarning: number;
  lastDate: string;
  personalData: PersonalData | null;
  vehicleData: VehicleData | null;
  documentData: DocumentData | null;
  setUser: (data: any) => void;
  setOnDuty: (data: boolean) => void;
  setLocation: (data: CustomLocation) => void;
  clearRiderData: () => void;
  setTodayEarning: (amount: number) => void;
  resetEarning: () => void;
  setPersonalData: (data: PersonalData) => void;
  setVehicleData: (data: VehicleData) => void;
  setDocumentData: (data: DocumentData) => void;
}

const today = new Date().toISOString().split('T')[0];

export const useRiderStore = create<RiderStoreProps>()(
  persist(
    (set, get) => ({
      user: null,
      location: null,
      todayEarning: 0,
      lastDate: today,
      onDuty: false,
      personalData: null,
      vehicleData: null,
      documentData: null,
      setUser: (data) => set({ user: data }),
      setLocation: (data) => set({ location: data }),
      setOnDuty: (data) => set({ onDuty: data }),
      clearRiderData: () => set({
        user: null, 
        location: null, 
        onDuty: false, 
        personalData: null, 
        vehicleData: null, 
        documentData: null
      }),
      setTodayEarning: (amount) => {
        const current = new Date().toISOString().split('T')[0];
        if (get().lastDate !== current) set({ todayEarning: 0, lastDate: current });
        set((s) => ({ todayEarning: s.todayEarning + amount }));
      },
      resetEarning: () => {
        const current = new Date().toISOString().split('T')[0];
        if (get().lastDate !== current) set({ todayEarning: 0, lastDate: current });
      },
      setPersonalData: (data) => set({ personalData: data }),
      setVehicleData: (data) => set({ vehicleData: data }),
      setDocumentData: (data) => set({ documentData: data })
    }),
    {
      name: "rider-store",
      partialize: (state) => ({
        user: state.user,
        personalData: state.personalData,
        vehicleData: state.vehicleData,
        documentData: state.documentData,
      }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
