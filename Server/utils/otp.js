/**
 * OTP utilities for generation and verification
 */

// Map to store OTPs with phone numbers as keys
const otpStore = new Map();

// Configurable OTP settings
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;

/**
 * Generate a random numeric OTP of specified length
 * @returns {string} The generated OTP
 */
const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

/**
 * Store OTP for a phone number with expiration
 * @param {string} phone - Phone number
 * @param {string} otp - Generated OTP
 */
const storeOTP = (phone, otp) => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + OTP_EXPIRY_MINUTES);
  
  otpStore.set(phone, {
    otp,
    expiry: expiryTime
  });
  
  console.log(`OTP generated for ${phone}: ${otp} (expires in ${OTP_EXPIRY_MINUTES} minutes)`);
  
  // Set timeout to remove the OTP after expiry
  setTimeout(() => {
    if (otpStore.has(phone) && otpStore.get(phone).otp === otp) {
      otpStore.delete(phone);
      console.log(`OTP for ${phone} expired and removed from store`);
    }
  }, OTP_EXPIRY_MINUTES * 60 * 1000);
};

/**
 * Verify OTP for a phone number
 * @param {string} phone - Phone number
 * @param {string} otp - OTP to verify
 * @returns {boolean} Whether the OTP is valid
 */
const verifyOTP = (phone, otp) => {
  // Check if OTP exists for the phone number
  if (!otpStore.has(phone)) {
    console.log(`No OTP found for ${phone}`);
    return false;
  }
  
  const storedData = otpStore.get(phone);
  
  // Check if OTP has expired
  if (new Date() > storedData.expiry) {
    console.log(`OTP for ${phone} has expired`);
    otpStore.delete(phone);
    return false;
  }
  
  // Verify OTP
  const isValid = storedData.otp === otp;
  
  // If valid, remove the OTP after successful verification
  if (isValid) {
    console.log(`OTP verified successfully for ${phone}`);
    otpStore.delete(phone);
  } else {
    console.log(`Invalid OTP provided for ${phone}`);
  }
  
  return isValid;
};

export { generateOTP, storeOTP, verifyOTP }; 