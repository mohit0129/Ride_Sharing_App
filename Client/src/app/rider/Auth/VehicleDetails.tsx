import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { useRiderStore } from '@/store/riderStore';

const VehicleDetails = () => {
  // Vehicle details state
  const [vehicleType, setVehicleType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [color, setColor] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const { setVehicleData } = useRiderStore();

  // Validation function
  const validateForm = () => {
    if (!vehicleType.trim()) {
      Alert.alert('Error', 'Please enter your vehicle type');
      return false;
    }
    if (!manufacturer.trim()) {
      Alert.alert('Error', 'Please enter the manufacturer');
      return false;
    }
    if (!model.trim()) {
      Alert.alert('Error', 'Please enter the model');
      return false;
    }
    if (!modelYear || isNaN(Number(modelYear)) || Number(modelYear) < 1900 || Number(modelYear) > new Date().getFullYear()) {
      Alert.alert('Error', 'Please enter a valid model year');
      return false;
    }
    if (!licensePlate.trim()) {
      Alert.alert('Error', 'Please enter the license plate number');
      return false;
    }
    if (!color.trim()) {
      Alert.alert('Error', 'Please enter the vehicle color');
      return false;
    }
    return true;
  };

  // Save and continue
  const handleContinue = () => {
    if (!validateForm()) return;
    
    // Store vehicle data in global state
    const vehicleDetails = {
      vehicleType,
      manufacturer,
      model,
      modelYear: Number(modelYear),
      licensePlate,
      color
    };
    
    setVehicleData(vehicleDetails);
    
    // Navigate to documents page
    router.push('/rider/Auth/Documents');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Vehicle Details</Text>
        <Text style={styles.subtitle}>Please provide your vehicle information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Type</Text>
          <TextInput
            value={vehicleType}
            onChangeText={setVehicleType}
            placeholder="e.g., bike, car, auto, cab economy"
            style={styles.input}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Manufacturer</Text>
          <TextInput
            value={manufacturer}
            onChangeText={setManufacturer}
            placeholder="e.g., Honda, Toyota, Suzuki"
            style={styles.input}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="e.g., Civic, Corolla, Swift"
            style={styles.input}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model Year</Text>
          <TextInput
            value={modelYear}
            onChangeText={setModelYear}
            placeholder="e.g., 2020"
            keyboardType="number-pad"
            style={styles.input}
            maxLength={4}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>License Plate Number</Text>
          <TextInput
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="e.g., ABC-1234"
            style={styles.input}
            autoCapitalize="characters"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vehicle Color</Text>
          <TextInput
            value={color}
            onChangeText={setColor}
            placeholder="e.g., Red, Black, Silver"
            style={styles.input}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VehicleDetails;
