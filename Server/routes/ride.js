//routes/ride.js
import express from 'express';
import { createRide, updateRideStatus, acceptRide, getMyRides, getAllRides, getRideById, deleteRide, rideStatusUpdate } from "../controllers/ride.js";

const router = express.Router();

router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.post("/create", createRide);
router.patch("/accept/:rideId", acceptRide);
router.patch("/update/:rideId", updateRideStatus);
router.patch("/update/status/:rideId", rideStatusUpdate);
router.get("/rides", getMyRides);
router.get("/", getAllRides);
router.get("/:rideId", getRideById);
router.delete("/:rideId", deleteRide);

export default router;
