// //routes/promoCode.js-new
// const express = require("express");
// const router = express.Router();
// const {
//   createPromoCode,
//   getAllPromoCodes,
//   validatePromoCode
// } = require("../controllers/promoCode");
// const adminAuth = require("../middleware/adminAuth");
// const auth = require("../middleware/authentication");

// router.post("/", adminAuth, createPromoCode);
// router.get("/", adminAuth, getAllPromoCodes);
// router.get("/validate/:code", auth, validatePromoCode);

// // module.exports = router;
// export default promoCode;

// routes/promoCode.js
import express from "express";
import {
  createPromoCode,
  getAllPromoCodes,
  validatePromoCode,
  getPromoCodeById,
  updatePromoCodeStatus,
  deletePromoCode
} from "../controllers/promoCode.js";
import { adminAuth } from "../middleware/authentication.js";
import auth from "../middleware/authentication.js";

const router = express.Router();

router.post("/", adminAuth, createPromoCode);

router.get("/", adminAuth, getAllPromoCodes);

router.get("/:id", adminAuth, getPromoCodeById);

router.patch("/:id", adminAuth, updatePromoCodeStatus);

router.delete("/:id", adminAuth, deletePromoCode);

router.get("/validate/:code", auth, validatePromoCode);

export default router;
