# Rider Registration Flow

This document explains the rider registration process in the RideNow application.

## Overview

The rider registration flow consists of multiple steps to collect all the necessary information:

1. **Phone Verification** - Verify the rider's phone number using OTP
2. **Personal Information** - Collect basic personal details
3. **Vehicle Details** - Collect information about the rider's vehicle
4. **Document Verification** - Collect and verify driver's license and vehicle registration

## Flow Details

### Step 1: Phone Verification

The flow begins with phone verification through OTP:

1. The user enters their phone number in `/rider/Auth/PhoneInput.tsx`
2. An OTP is sent to the phone number via the `/otp/generate` endpoint
3. The user enters the OTP in `/rider/Auth/OTPVerification.tsx`
4. If the OTP is valid, the system checks if the user already exists
   - If the user exists as a rider, they are logged in directly
   - If the user exists as a customer, they're asked to use a different number
   - If the user is new, they proceed to the personal information step

### Step 2: Personal Information

In `/rider/Auth/PersonalInformation.tsx`, the rider provides:
- First name
- Last name
- Email (optional)
- Date of birth

This information is stored in the `personalData` field of the rider store for later use.

### Step 3: Vehicle Details

In `/rider/Auth/VehicleDetails.tsx`, the rider provides:
- Vehicle type (bike, car, auto, cab economy)
- Manufacturer
- Model
- Model year
- License plate number
- Vehicle color
- Photos of the vehicle (front, back, and side views)

This information is stored in the `vehicleData` field of the rider store.

### Step 4: Document Verification

In `/rider/Auth/Documents.tsx`, the rider provides:
- Driver's license number and expiry date
- Driver's license photos (front and back)
- Vehicle registration certificate (RC) number and expiry date
- Vehicle RC photos (front and back)

At this point, all the data collected throughout the registration process is sent to the server via the `/auth/signup` endpoint with the role set to 'rider'.

## Data Management

Data collected during the registration process is managed using Zustand state management in the rider store:

- `userId` - Stores the phone number after OTP verification
- `personalData` - Stores personal information from Step 2
- `vehicleData` - Stores vehicle details from Step 3
- `documentData` - Stores document information from Step 4

The rider store is specifically designed to handle rider-specific data and is separate from the user store which handles general customer data.

## Security Considerations

- Photos are not currently uploaded to the server in this implementation
- In a production environment, photos would be uploaded securely and URLs would be stored
- OTP verification ensures that the phone number belongs to the user
- Document expiry dates are validated to ensure they're valid and not expired

## Future Enhancements

1. Add actual image upload to a server or cloud storage
2. Implement document verification by admin before activating rider account
3. Add geo-verification for rider's location
4. Implement background checks for riders 