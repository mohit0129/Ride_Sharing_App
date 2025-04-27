import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { appAxios } from '@/service/apiInterceptors';
import { router } from 'expo-router';
import { useUserStore } from '@/store/userStore';

const PhoneInput = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();

  const handleSendOtp = async () => {
    // Validate phone number
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // Use the new OTP generation endpoint
      const response = await appAxios.post('/otp/generate', { 
        phone
      });
      
      // Log the response for debugging
      console.log('Generate OTP Response:', response.data);
      
      // Store phone number in memory for next steps
      setUser({ phone });
      
      // Navigate to OTP verification screen
      router.navigate("/customer/Auth/OTPVerification");
    } catch (error: any) {
      console.error('Error generating OTP:', error);
      Alert.alert(
        'Error', 
        `Error generating OTP: ${error?.message || error?.response?.data?.message || 'Failed to send OTP. Please try again.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your mobile number</Text>
      <Text style={styles.subtitle}>We will send you a verification code</Text>
      
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        style={styles.input}
        maxLength={10}
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PhoneInput;
