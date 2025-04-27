# OTP Authentication Flow - Client Side

This document explains how the OTP authentication flow works in the RideNow mobile app.

## Overview

The OTP authentication system provides a secure way for users to authenticate using their phone numbers. The flow consists of two main screens:

1. **Phone Input** - Where users enter their phone number
2. **OTP Verification** - Where users enter the OTP received on their phone

## Flow Details

### Phone Input Screen

Located at: `Client/src/app/customer/Auth/PhoneInput.tsx`

When a user enters their phone number and taps "Send OTP":

1. The app validates the phone number format
2. It sends a request to the `/otp/generate` endpoint with the phone number
3. The server generates a 6-digit OTP and displays it in the server console (in production, this would be sent via SMS)
4. The client stores the phone number using `useUserStore` 
5. The user is navigated to the OTP verification screen

### OTP Verification Screen

Located at: `Client/src/app/customer/Auth/OTPVerification.tsx`

When a user enters the OTP and taps "Verify OTP":

1. The app validates that an OTP was entered
2. It sends a request to the `/otp/verify` endpoint with the phone number and OTP
3. If verification is successful, the server responds with:
   - For new users: A flag indicating this is a new user
   - For existing users: User data and authentication tokens

4. Based on the response:
   - New users are navigated to the Personal Information screen to complete registration
   - Existing users have their tokens stored and are navigated directly to the home screen

### Resending OTP

Users can request a new OTP after a 60-second cooldown period. This helps prevent abuse while still providing a way to recover if an OTP wasn't received.

## Implementation Notes

- The OTP verification process uses an in-memory store on the server with a 5-minute expiration time
- For security, OTPs are logged to the console on the server, not sent in the API response
- Authentication tokens are stored using secure storage via the `mmkvStorage` mechanism
- Error handling provides clear feedback to users if OTP generation or verification fails

## Security Considerations

- OTPs expire after 5 minutes
- OTPs are removed from the server after successful verification or expiration
- HTTP requests are handled using axios with interceptors to manage tokens
- Authentication tokens have appropriate expiration times 