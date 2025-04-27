# OTP Generation and Verification System

This document explains how the OTP (One-Time Password) system works in the RideNow application.

## Overview

The OTP system provides a secure way to verify users through their phone numbers. It has two main functionalities:
1. Generating an OTP when a user enters their phone number
2. Verifying the OTP when the user submits it

## How It Works

### OTP Generation

1. When a user enters their phone number, the client makes a request to the `/otp/generate` endpoint.
2. The server generates a 6-digit random OTP.
3. The OTP is stored in memory with the associated phone number and an expiration time of 5 minutes.
4. The server logs the OTP to the console (in a production environment, this would be sent via SMS).
5. The server responds with a success message and whether the phone number is associated with an existing user.

### OTP Verification

1. When a user enters the OTP, the client makes a request to the `/otp/verify` endpoint.
2. The server checks if the OTP is valid for the given phone number and not expired.
3. If valid, the OTP is removed from storage to prevent reuse.
4. If the phone is associated with an existing user, authentication tokens are generated.
5. The server responds with user data and tokens if the user exists, or indicates that the user is new.

## API Endpoints

### Generate OTP

```
POST /otp/generate
```

Request Body:
```json
{
  "phone": "1234567890"
}
```

Response:
```json
{
  "message": "OTP generated successfully",
  "phoneNumber": "1234567890",
  "userExists": true
}
```

### Verify OTP

```
POST /otp/verify
```

Request Body:
```json
{
  "phone": "1234567890",
  "otp": "123456"
}
```

Response for existing user:
```json
{
  "message": "OTP verification successful",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "customer",
    "status": "active"
  },
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "isNewUser": false
}
```

Response for new user:
```json
{
  "message": "OTP verification successful",
  "isNewUser": true,
  "phone": "1234567890"
}
```

## Implementation Details

The OTP system consists of three main components:

1. **Utils** (`utils/otp.js`) - Contains the core functionality for generating, storing, and verifying OTPs.
2. **Controller** (`controllers/otp.js`) - Handles HTTP requests and responses for OTP operations.
3. **Router** (`routes/otp.js`) - Defines the API endpoints for OTP operations.

## Security Considerations

- OTPs expire after 5 minutes for security.
- OTPs are removed after successful verification to prevent reuse.
- OTPs are stored in memory rather than in the database.
- In a production environment, OTPs should be sent via SMS instead of being logged to the console.

## Integration with Existing Auth System

The OTP system integrates with the existing authentication system:
- For existing users, it generates the same access and refresh tokens used in the regular signin flow.
- For new users, it indicates that they need to complete the registration process.

## Development Note

For the development phase, OTPs are logged to the console. In a production environment, you would need to integrate with an SMS service provider to send the OTPs to users' phones. 