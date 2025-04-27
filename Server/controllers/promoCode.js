// //controllers/promoCode.js-new
// const PromoCode = require("../models/PromoCode");
// const { StatusCodes } = require("http-status-codes");
// const { BadRequestError, NotFoundError } = require("../errors");

// const createPromoCode = async (req, res) => {
//   const { promoCode, discount, expiryDate } = req.body;

//   const promo = await PromoCode.create({
//     promoCode,
//     discount,
//     expiryDate
//   });

//   res.status(StatusCodes.CREATED).json({ promo });
// };

// const getAllPromoCodes = async (req, res) => {
//   const promoCodes = await PromoCode.find({});
//   res.status(StatusCodes.OK).json({ promoCodes, count: promoCodes.length });
// };

// const validatePromoCode = async (req, res) => {
//   const { code } = req.params;

//   const promoCode = await PromoCode.findOne({
//     promoCode: code.toUpperCase(),
//     status: "active",
//     expiryDate: { $gt: new Date() }
//   });

//   if (!promoCode) {
//     throw new NotFoundError("Invalid or expired promo code");
//   }

//   res.status(StatusCodes.OK).json({ promoCode });
// };

// module.exports = {
//   createPromoCode,
//   getAllPromoCodes,
//   validatePromoCode
// };

// controllers/promoCode.js
import PromoCode from "../models/PromoCode.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

export const createPromoCode = async (req, res) => {
  const { promoCode, discount, expiryDate } = req.body;

  if (!promoCode || !discount || !expiryDate) {
    throw new BadRequestError("Promo code, discount, and expiry date are required");
  }

  try {
    const promo = await PromoCode.create({
      promoCode,
      discount,
      expiryDate,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Promo code created successfully",
      promo,
    });
  } catch (error) {
    console.error("Error creating promo code:", error);
    throw new BadRequestError("Failed to create promo code");
  }
};

export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({});
    res.status(StatusCodes.OK).json({
      message: "Promo codes retrieved successfully",
      promoCodes,
      count: promoCodes.length,
    });
  } catch (error) {
    console.error("Error retrieving promo codes:", error);
    throw new BadRequestError("Failed to retrieve promo codes");
  }
};

export const validatePromoCode = async (req, res) => {
  const { code } = req.params;

  try {
    const promoCode = await PromoCode.findOne({
      promoCode: code.toUpperCase(),
      status: "active",
      expiryDate: { $gt: new Date() },
    });

    if (!promoCode) {
      throw new NotFoundError("Invalid or expired promo code");
    }

    res.status(StatusCodes.OK).json({
      message: "Promo code is valid",
      promoCode,
    });
  } catch (error) {
    console.error("Error validating promo code:", error);
    throw new BadRequestError("Failed to validate promo code");
  }
};

// Get a promo code by ID (Admin only)
export const getPromoCodeById = async (req, res) => {
  const { id: promoId } = req.params;

  try {
    const promo = await PromoCode.findById(promoId);

    if (!promo) {
      throw new NotFoundError(`No promo code found with ID ${promoId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Promo code retrieved successfully",
      promo,
    });
  } catch (error) {
    console.error("Error retrieving promo code:", error);
    throw new BadRequestError("Failed to retrieve promo code");
  }
};

// Update promo code status (Admin only)
export const updatePromoCodeStatus = async (req, res) => {
  const { id: promoId } = req.params;
  const { status } = req.body;

  if (!status || !["active", "expired"].includes(status)) {
    throw new BadRequestError("Invalid status. Allowed values: active, expired.");
  }

  try {
    const promo = await PromoCode.findByIdAndUpdate(
      promoId,
      { status },
      { new: true, runValidators: true }
    );

    if (!promo) {
      throw new NotFoundError(`No promo code found with ID ${promoId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Promo code status updated successfully",
      promo,
    });
  } catch (error) {
    console.error("Error updating promo code status:", error);
    throw new BadRequestError("Failed to update promo code status");
  }
};

// Delete a promo code (Admin only)
export const deletePromoCode = async (req, res) => {
  const { id: promoId } = req.params;

  try {
    const promo = await PromoCode.findByIdAndDelete(promoId);

    if (!promo) {
      throw new NotFoundError(`No promo code found with ID ${promoId}`);
    }

    res.status(StatusCodes.OK).json({
      message: "Promo code deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting promo code:", error);
    throw new BadRequestError("Failed to delete promo code");
  }
};