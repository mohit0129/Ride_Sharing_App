import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { appAxios } from '@/service/apiInterceptors';
import { router } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { tokenStorage } from '@/store/storage';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60);
  const { user, setUser } = useUserStore();

  // Countdown timer
  useEffect(() => {
    if (remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remainingTime]);

  const handleResendOTP = async () => {
    if (remainingTime > 0) return;
    
    setLoading(true);
    try {
      if (!user || !user.phone) {
        throw new Error("Phone number not found");
      }
      
      // Use the new OTP generation endpoint
      await appAxios.post('/otp/generate', { 
        phone: user.phone
      });
      setRemainingTime(60);
      Alert.alert('Success', 'New OTP has been sent to your phone');
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      Alert.alert(
        'Error', 
        error?.response?.data?.message || error.message || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP code');
      return;
    }

    if (!user || !user.phone) {
      Alert.alert('Error', 'Phone number not found. Please go back and try again.');
      return;
    }

    setLoading(true);
    try {
      console.log(`Verifying OTP for phone: ${user.phone} with code: ${otp}`);
      
      // Use the new OTP verification endpoint
      const response = await appAxios.post('/otp/verify', { 
        phone: user.phone,
        otp
      });
      
      console.log('OTP Verification Response:', response.data);
      
      if (response.data.isNewUser) {
        // User is new, navigate to personal information form
        router.push('/customer/Auth/PersonalInformation');
      } else {
        // Existing user, store tokens and user info
        const { access_token, refresh_token, user: userData } = response.data;
        
        // Store tokens using access_token to match authService
        tokenStorage.set('access_token', access_token);
        tokenStorage.set('refresh_token', refresh_token);
        
        // Store user data
        setUser(userData);
        
        // Navigate to home screen
        router.replace('/customer/home');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      // More detailed error message for debugging
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
      }
      
      Alert.alert(
        'Invalid OTP', 
        error?.response?.data?.message || 'The OTP you entered is incorrect.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Phone Number</Text>
      <Text style={styles.subtitle}>
        Enter the code sent to {user?.phone ? user.phone : 'your phone'}
      </Text>
      
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        style={styles.input}
        maxLength={6}
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn't receive the code? 
        </Text>
        <TouchableOpacity 
          onPress={handleResendOTP}
          disabled={remainingTime > 0 || loading}
        >
          <Text style={[
            styles.resendButton, 
            remainingTime > 0 && styles.resendDisabled
          ]}>
            {remainingTime > 0 
              ? `Resend OTP in ${remainingTime}s` 
              : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
      </View>
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
    textAlign: 'center',
    letterSpacing: 4,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    color: '#666',
  },
  resendButton: {
    color: '#007BFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  resendDisabled: {
    color: '#999',
  }
});

export default OTPVerification;
