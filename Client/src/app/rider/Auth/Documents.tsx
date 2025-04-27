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
  Platform,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { useRiderStore } from '@/store/riderStore';
import { Ionicons } from '@expo/vector-icons';
import { appAxios } from '@/service/apiInterceptors';
import { tokenStorage } from '@/store/storage';

const Documents = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');
  const [hasLicenseDocument, setHasLicenseDocument] = useState(false);
  const [hasInsuranceDocument, setHasInsuranceDocument] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { 
    user, 
    personalData, 
    vehicleData, 
    setDocumentData,
    setUser 
  } = useRiderStore();

  // Handle document addition
  const handleAddDocument = (documentType: string) => {
    Alert.alert(
      'Add Document',
      `Please select a ${documentType} document from your device`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            if (documentType === 'Driver\'s License') {
              setHasLicenseDocument(true);
            } else if (documentType === 'Insurance') {
              setHasInsuranceDocument(true);
            }
          }
        }
      ]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!hasLicenseDocument || !licenseNumber.trim() || !licenseExpiryDate.trim()) {
      Alert.alert('Error', 'Please add your driver\'s license and fill in all required fields');
      return;
    }
    
    if (!hasInsuranceDocument || !insuranceNumber.trim() || !insuranceExpiryDate.trim()) {
      Alert.alert('Error', 'Please add your insurance document and fill in all required fields');
      return;
    }

    if (!user || !user.phone) {
      Alert.alert('Error', 'Phone number not found. Please go back and try again.');
      return;
    }
    
    // Store document data in rider store
    const documentData = {
      driverLicense: {
        number: licenseNumber,
        expiryDate: licenseExpiryDate,
        images: {
          front: "placeholder-license-front.jpg",
          back: "placeholder-license-back.jpg"
        }
      },
      vehicleRC: {
        number: insuranceNumber,
        expiryDate: insuranceExpiryDate,
        images: {
          front: "placeholder-insurance-front.jpg",
          back: "placeholder-insurance-back.jpg"
        }
      }
    };
    
    setDocumentData(documentData);
    
    setLoading(true);
    
    try {
      // Prepare complete registration data
      const registrationData = {
        phone: user.phone,
        firstName: personalData?.firstName,
        lastName: personalData?.lastName,
        email: personalData?.email,
        birthDate: personalData?.birthDate,
        vehicle: {
          type: vehicleData?.vehicleType,
          manufacturer: vehicleData?.manufacturer,
          model: vehicleData?.model,
          year: vehicleData?.modelYear,
          licensePlate: vehicleData?.licensePlate,
          color: vehicleData?.color
        },
        documents: {
          license: {
            number: licenseNumber,
            expiryDate: licenseExpiryDate
          },
          insurance: {
            number: insuranceNumber,
            expiryDate: insuranceExpiryDate
          }
        },
        role: 'rider'
      };
      
      // Register the user
      const response = await appAxios.post('/auth/signup', registrationData);
      
      // Store authentication tokens
      const { access_token, refresh_token, user: userData } = response.data;
      tokenStorage.set('access_token', access_token);
      tokenStorage.set('refresh_token', refresh_token);
      
      // Store user data
      setUser(userData);
      
      Alert.alert(
        'Registration Successful',
        'Your rider registration is complete. You\'ll be notified once your documents are verified.',
        [{ text: 'OK', onPress: () => router.replace('/rider/home') }]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // More detailed error message for debugging
      if (error.response) {
        console.error('Response error data:', error.response.data);
        console.error('Response error status:', error.response.status);
      }
      
      Alert.alert(
        'Registration Failed',
        error?.response?.data?.msg || error?.response?.data?.message || 'There was an error completing your registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Documents</Text>
        
        {/* Driver's License Card */}
        <View style={styles.documentCard}>
          <View style={styles.documentIconContainer}>
            <Ionicons name="document-text-outline" size={60} color="#666" />
          </View>
          <View style={styles.documentDetails}>
            <Text style={styles.documentTitle}>Driver's License</Text>
            <Text style={styles.documentExpiry}>
              Expiry Date : {hasLicenseDocument ? licenseExpiryDate : '-'}
            </Text>
            <View style={[
              styles.documentStatus,
              hasLicenseDocument ? styles.documentStatusSuccess : styles.documentStatusPending
            ]}>
              <Text style={styles.documentStatusText}>
                {hasLicenseDocument ? 'Added' : 'No Document'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddDocument('Driver\'s License')}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {/* License Input Fields */}
        {hasLicenseDocument && (
          <View style={styles.documentInputs}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>License Number</Text>
              <TextInput
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                placeholder="Enter your license number"
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                value={licenseExpiryDate}
                onChangeText={setLicenseExpiryDate}
                placeholder="YYYY-MM-DD"
                style={styles.input}
              />
            </View>
          </View>
        )}
        
        {/* Insurance Card */}
        <View style={styles.documentCard}>
          <View style={styles.documentIconContainer}>
            <Ionicons name="document-text-outline" size={60} color="#666" />
          </View>
          <View style={styles.documentDetails}>
            <Text style={styles.documentTitle}>Insurance</Text>
            <Text style={styles.documentExpiry}>
              Expiry Date : {hasInsuranceDocument ? insuranceExpiryDate : '-'}
            </Text>
            <View style={[
              styles.documentStatus,
              hasInsuranceDocument ? styles.documentStatusSuccess : styles.documentStatusPending
            ]}>
              <Text style={styles.documentStatusText}>
                {hasInsuranceDocument ? 'Added' : 'No Document'}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleAddDocument('Insurance')}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {/* Insurance Input Fields */}
        {hasInsuranceDocument && (
          <View style={styles.documentInputs}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Insurance Number</Text>
              <TextInput
                value={insuranceNumber}
                onChangeText={setInsuranceNumber}
                placeholder="Enter your insurance number"
                style={styles.input}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                value={insuranceExpiryDate}
                onChangeText={setInsuranceExpiryDate}
                placeholder="YYYY-MM-DD"
                style={styles.input}
              />
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Documents</Text>
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
    marginBottom: 30,
    marginTop: 10,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIconContainer: {
    width: 70,
    alignItems: 'center',
  },
  documentDetails: {
    flex: 1,
    marginLeft: 10,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  documentExpiry: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  documentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  documentStatusPending: {
    backgroundColor: '#ff6b6b',
  },
  documentStatusSuccess: {
    backgroundColor: '#51cf66',
  },
  documentStatusText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButtonText: {
    fontWeight: '500',
    color: '#333',
  },
  documentInputs: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
    marginTop: -10,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Documents;
