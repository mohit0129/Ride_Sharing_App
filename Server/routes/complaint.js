// //routes/complaint.js-new
// const express = require("express");
// const router = express.Router();
// const {
//   createComplaint,
//   updateComplaint,
//   getAllComplaints,
//   getUserComplaints
// } = require("../controllers/complaint");
// const adminAuth = require("../middleware/adminAuth");
// const auth = require("../middleware/authentication");

// router.post("/", auth, createComplaint);
// router.patch("/:id", adminAuth, updateComplaint);
// router.get("/", adminAuth, getAllComplaints);
// router.get("/user", auth, getUserComplaints);

// // module.exports = router;
// export default complaing;

// routes/complaint.js
import express from "express";
import {
  createComplaint,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,
  getUserComplaints,
  getComplaintById
} from "../controllers/complaint.js";
import { adminAuth } from "../middleware/authentication.js";
import auth from "../middleware/authentication.js";

const router = express.Router();

router.post("/", auth, createComplaint);

router.patch("/:id", adminAuth, updateComplaint);

router.get("/", adminAuth, getAllComplaints);

router.get("/user", auth, getUserComplaints);

router.get("/:id", adminAuth, getComplaintById);

router.delete("/:id", adminAuth, deleteComplaint);


export default router;
