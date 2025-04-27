import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MMKV } from 'react-native-mmkv';
import { Colors } from '@/utils/Constants';
import CustomText from '@/components/shared/CustomText';
import { router } from 'expo-router';

const storage = new MMKV();

interface PaymentMethodProps {
  onSelect?: (method: string) => void;
  onBack?: () => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ onSelect, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedPayment = storage.getString('paymentMethod');
    if (savedPayment) {
      const paymentDetails = JSON.parse(savedPayment);
      setSelectedMethod(paymentDetails.selectedMethod);
      setCardNumber(paymentDetails.cardNumber || '');
      setExpiryDate(paymentDetails.expiryDate || '');
      setCvv(paymentDetails.cvv || '');
      setCardHolder(paymentDetails.cardHolder || '');
    }
  }, []);

  const methods = [
    { id: 'credit_card', label: 'Credit Card', icon: 'card', color: '#5B5CE2' },
    { id: 'paypal', label: 'PayPal', icon: 'logo-paypal', color: '#0D9BDB' },
    { id: 'apple_pay', label: 'Apple Pay', icon: 'logo-apple', color: '#000000' },
    { id: 'google_pay', label: 'Google Pay', icon: 'logo-google', color: '#4285F4' },
    { id: 'Cash', label: 'Cash', icon: 'cash', color: '#18ab02' },
  ];

  const handleSelect = (method: string) => {
    setSelectedMethod(method);
    if (onSelect) {
      onSelect(method);
    }
  };

  const formatCardNumber = (text: string) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    // Remove non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Format as MM/YY
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const savePaymentMethod = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    if (selectedMethod === 'credit_card') {
      if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }

      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Error', 'Please enter a valid 16-digit card number');
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
        return;
      }

      if (cvv.length < 3) {
        Alert.alert('Error', 'Please enter a valid CVV');
        return;
      }
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        const paymentDetails = { 
          selectedMethod, 
          cardNumber, 
          expiryDate, 
          cvv,
          cardHolder
        };
        storage.set('paymentMethod', JSON.stringify(paymentDetails));
        setIsLoading(false);
        Alert.alert('Success', 'Payment method saved successfully!');
        router.back();
      } catch (error) {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to save payment method');
      }
    }, 1000);
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name='chevron-back' size={24} color={Colors.iosColor} />
            <CustomText fontFamily='Regular' style={styles.backText}>Back</CustomText>
          </TouchableOpacity>
          
          <CustomText fontFamily='Bold' style={styles.title}>Payment Method</CustomText>
          <CustomText fontFamily='Regular' style={styles.subtitle}>Select your preferred payment option</CustomText>
          
          <View style={styles.methodsContainer}>
            {methods.map(({ id, label, icon, color }) => (
              <TouchableOpacity
                key={id}
                style={[
                  styles.methodButton,
                  selectedMethod === id && styles.selectedButton,
                  { borderColor: selectedMethod === id ? color : '#E8E8E8' }
                ]}
                onPress={() => handleSelect(id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                  <Ionicons name={icon} size={28} color={color} />
                </View>
                <CustomText 
                  fontFamily={selectedMethod === id ? 'SemiBold' : 'Regular'} 
                  style={styles.methodText}
                >
                  {label}
                </CustomText>
                {selectedMethod === id && (
                  <View style={styles.checkContainer}>
                    <Ionicons name="checkmark-circle" size={24} color={color} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedMethod === 'credit_card' && (
            <View style={styles.cardDetailsContainer}>
              <CustomText fontFamily='SemiBold' style={styles.sectionTitle}>Card Details</CustomText>
              
              <View style={styles.inputWrapper}>
                <CustomText fontFamily='Regular' style={styles.inputLabel}>Cardholder Name</CustomText>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  placeholderTextColor="#A0A0A0"
                />
              </View>
              
              <View style={styles.inputWrapper}>
                <CustomText fontFamily='Regular' style={styles.inputLabel}>Card Number</CustomText>
                <View style={styles.cardNumberInput}>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    keyboardType="numeric"
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    maxLength={19}
                    placeholderTextColor="#A0A0A0"
                  />
                  <Ionicons name="card-outline" size={24} color="#A0A0A0" style={styles.inputIcon} />
                </View>
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
                  <CustomText fontFamily='Regular' style={styles.inputLabel}>Expiry Date</CustomText>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    maxLength={5}
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
                
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <CustomText fontFamily='Regular' style={styles.inputLabel}>CVV</CustomText>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="numeric"
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={4}
                    placeholderTextColor="#A0A0A0"
                  />
                </View>
              </View>
            </View>
          )}
          
          {/* Add padding at the bottom to ensure content is not hidden by the sticky button */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Sticky button container */}
      <View style={styles.stickyButtonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedMethod || isLoading) && styles.disabledButton
          ]}
          onPress={savePaymentMethod}
          disabled={!selectedMethod || isLoading}
          activeOpacity={0.8}
        >
          <CustomText fontFamily='SemiBold' style={styles.saveButtonText}>
            {isLoading ? 'Processing...' : 'Save Payment Method'}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 24, // Add padding at the bottom
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    fontSize: 16,
    color: Colors.iosColor,
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    color: '#222222',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  methodsContainer: {
    marginBottom: 32,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedButton: {
    borderWidth: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodText: {
    fontSize: 16,
    color: '#222222',
    flex: 1,
  },
  checkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetailsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#222222',
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222222',
    backgroundColor: '#F9F9F9',
  },
  cardNumberInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Sticky button container
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Shadow for Android
    elevation: 5,
  },
  saveButton: {
    backgroundColor: Colors.iosColor,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  bottomPadding: {
    height: 80, // Match the height of the sticky button container + padding
  },
});

export default PaymentMethod;