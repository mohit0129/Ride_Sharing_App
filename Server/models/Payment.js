//models/Payment.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  paymentId: {
    type: String,
    unique: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  riderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rideId: {
    type: Schema.Types.ObjectId,
    ref: "Ride",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "wallet"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "failed", "completed"],
    default: "pending"
  }
}, {
  timestamps: true
});

// Generate payment ID before saving
paymentSchema.pre("save", async function(next) {
  if (this.isNew) {
    const count = await mongoose.model("Payment").countDocuments();
    this.paymentId = `PAY${String(count + 1).padStart(8, "0")}`;
  }
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;