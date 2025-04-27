// //routes/payment.js-new
// const express = require("express");
// const router = express.Router();
// const {
//   createPayment,
//   updatePaymentStatus,
//   getPaymentDetails,
//   getUserPayments
// } = require("../controllers/payment");
// const adminAuth = require("../middleware/adminAuth");
// const auth = require("../middleware/authentication");

// router.post("/", auth, createPayment);
// router.patch("/:id", adminAuth, updatePaymentStatus);
// router.get("/:id", auth, getPaymentDetails);
// router.get("/user/history", auth, getUserPayments);

// // module.exports = router;
// export default payment;

// routes/payment.js
import express from "express";
import {
  createPayment,
  updatePaymentStatus,
  getPaymentDetails,
  getUserPayments,
  getAllPayments,
  deletePayment
} from "../controllers/payment.js";
import { adminAuth } from "../middleware/authentication.js";
import auth from "../middleware/authentication.js";

const router = express.Router();

router.post("/", auth, createPayment);

router.get("/", adminAuth, getAllPayments);

router.patch("/:id", adminAuth, updatePaymentStatus);

router.delete("/:id", adminAuth, deletePayment);

router.get("/:id", auth, getPaymentDetails);

router.get("/user/history", auth, getUserPayments);

export default router;
