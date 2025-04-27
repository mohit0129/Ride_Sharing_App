// //controllers/payment.js-new
// const Payment = require("../models/Payment");
// const { StatusCodes } = require("http-status-codes");
// const { BadRequestError, NotFoundError } = require("../errors");

// const createPayment = async (req, res) => {
//   const { rideId, amount, paymentMethod } = req.body;
//   const customerId = req.user.id;

//   const payment = await Payment.create({
//     customerId,
//     rideId,
//     amount,
//     paymentMethod
//   });

//   res.status(StatusCodes.CREATED).json({ payment });
// };

// const updatePaymentStatus = async (req, res) => {
//   const { id: paymentId } = req.params;
//   const { status } = req.body;

//   const payment = await Payment.findOneAndUpdate(
//     { _id: paymentId },
//     { status },
//     { new: true, runValidators: true }
//   );

//   if (!payment) {
//     throw new NotFoundError(`No payment with id ${paymentId}`);
//   }

//   res.status(StatusCodes.OK).json({ payment });
// };

// const getPaymentDetails = async (req, res) => {
//   const { id: paymentId } = req.params;

//   const payment = await Payment.findOne({ _id: paymentId })
//     .populate("customerId", "phone")
//     .populate("riderId", "phone")
//     .populate("rideId");

//   if (!payment) {
//     throw new NotFoundError(`No payment with id ${paymentId}`);
//   }

//   res.status(StatusCodes.OK).json({ payment });
// };

// const getUserPayments = async (req, res) => {
//   const payments = await Payment.find({ customerId: req.user.id })
//     .populate("riderId", "phone")
//     .populate("rideId");

//   res.status(StatusCodes.OK).json({ payments, count: payments.length });
// };

// module.exports = {
//   createPayment,
//   updatePaymentStatus,
//   getPaymentDetails,
//   getUserPayments
// };

// controllers/payment.js
import Payment from "../models/Payment.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import mongoose from "mongoose";

// export const createPayment = async (req, res) => {
//   const { rideId, amount, paymentMethod } = req.body;
//   const customerId = req.user.id;

//   if (!rideId || !amount || !paymentMethod) {
//     throw new BadRequestError("Ride ID, amount, and payment method are required");
//   }

//   try {
//     const payment = await Payment.create({
//       customerId,
//       rideId,
//       amount,
//       paymentMethod,
//     });

//     res.status(StatusCodes.CREATED).json({
//       message: "Payment created successfully",
//       payment,
//     });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     throw new BadRequestError("Failed to create payment");
//   }
// };

//controllers/payment.js
export const createPayment = async (req, res) => {
  const { rideId, amount, paymentMethod, riderId } = req.body;
  const customerId = req.user.id;

  if (!rideId || !amount || !paymentMethod || !riderId) {
    throw new BadRequestError("Ride ID, amount, payment method, and rider ID are required");
  }

  // Validate rideId and riderId as ObjectId
  if (!mongoose.Types.ObjectId.isValid(rideId) || !mongoose.Types.ObjectId.isValid(riderId)) {
    throw new BadRequestError("Invalid rideId or riderId format");
  }

  try {
    const payment = await Payment.create({
      customerId,
      rideId: new mongoose.Types.ObjectId(rideId),
      riderId: new mongoose.Types.ObjectId(riderId),
      amount,
      paymentMethod,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new BadRequestError("Failed to create payment");
  }
};

export const updatePaymentStatus = async (req, res) => {
  const { id: paymentId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new BadRequestError("Payment status is required");
  }

  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: paymentId },
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      throw new NotFoundError(`No payment found with id ${paymentId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Payment status updated successfully",
      payment,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new BadRequestError("Failed to update payment status");
  }
};

export const getPaymentDetails = async (req, res) => {
  const { id: paymentId } = req.params;

  try {
    const payment = await Payment.findOne({ _id: paymentId })
      .populate("customerId", "phone")
      .populate("riderId", "phone")
      .populate("rideId");

    if (!payment) {
      throw new NotFoundError(`No payment found with id ${paymentId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Payment details retrieved successfully",
      payment,
    });
  } catch (error) {
    console.error("Error retrieving payment details:", error);
    throw new BadRequestError("Failed to retrieve payment details");
  }
};

export const getUserPayments = async (req, res) => {
  const customerId = req.user.id;

  try {
    const payments = await Payment.find({ customerId })
      .populate("riderId", "phone")
      .populate("rideId");

    res.status(StatusCodes.OK).json({
      message: "User payments retrieved successfully",
      payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Error retrieving user payments:", error);
    throw new BadRequestError("Failed to retrieve user payments");
  }
};


// Get all payments (Admin only)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("customerId", "phone")
      .populate("riderId", "phone")
      .populate("rideId");

    res.status(StatusCodes.OK).json({
      message: "All payments retrieved successfully",
      payments,
      count: payments.length,
    });
  } catch (error) {
    console.error("Error retrieving all payments:", error);
    throw new BadRequestError("Failed to retrieve payments");
  }
};

// Delete a payment (Admin only)
export const deletePayment = async (req, res) => {
  const { id: paymentId } = req.params;

  try {
    const payment = await Payment.findByIdAndDelete(paymentId);

    if (!payment) {
      throw new NotFoundError(`No payment found with ID ${paymentId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw new BadRequestError("Failed to delete payment");
  }
};