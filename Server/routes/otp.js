import express from 'express';
import { generateUserOTP, verifyUserOTP } from '../controllers/otp.js';

const router = express.Router();

/**
 * @route POST /otp/generate
 * @desc Generate OTP for a phone number
 * @access Public
 */
router.post('/generate', generateUserOTP);

/**
 * @route POST /otp/verify
 * @desc Verify OTP for a phone number
 * @access Public
 */
router.post('/verify', verifyUserOTP);

export default router; 