import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import User from "../models/User.js";
import { generateOTP, storeOTP, verifyOTP } from "../utils/otp.js";

/**
 * Generate OTP for a phone number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const generateUserOTP = async (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    throw new BadRequestError("Please provide a phone number");
  }
  
  try {
    // Check if the phone number exists in the database
    const user = await User.findOne({ phone });
    
    // Generate OTP regardless of whether user exists or not
    const otp = generateOTP();
    
    // Store the OTP
    storeOTP(phone, otp);
    
    // In a production environment, you would send the OTP via SMS
    // For now, we're just logging it to the console
    
    res.status(StatusCodes.OK).json({
      message: "OTP generated successfully",
      phoneNumber: phone,
      userExists: !!user,
      // Commenting out the OTP in the response for security reasons
      // In a real app, you would never return this to the client
      // otpForTesting: otp 
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Verify OTP for a phone number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const verifyUserOTP = async (req, res) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) {
    throw new BadRequestError("Please provide phone number and OTP");
  }
  
  try {
    // Verify the OTP
    const isValid = verifyOTP(phone, otp);
    
    if (!isValid) {
      throw new UnauthenticatedError("Invalid or expired OTP");
    }
    
    // Find the user to check if they exist
    const user = await User.findOne({ phone });
    
    // If user exists, generate tokens for authentication
    if (user) {
      const accessToken = user.createAccessToken();
      const refreshToken = user.createRefreshToken();
      
      // Return user data without sensitive information
      const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      };
      
      return res.status(StatusCodes.OK).json({
        message: "OTP verification successful",
        user: userResponse,
        access_token: accessToken,
        refresh_token: refreshToken,
        isNewUser: false
      });
    } else {
      // User doesn't exist yet, but OTP was valid
      return res.status(StatusCodes.OK).json({
        message: "OTP verification successful",
        isNewUser: true,
        phone
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 