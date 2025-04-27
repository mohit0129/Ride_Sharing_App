//models/PromoCode.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema({
  promoId: {
    type: String,
    unique: true
  },
  promoCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active"
  }
}, {
  timestamps: true
});

// Generate promo ID before saving
promoCodeSchema.pre("save", async function(next) {
  if (this.isNew) {
    const count = await mongoose.model("PromoCode").countDocuments();
    this.promoId = `PROMO${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Update status based on expiry date
promoCodeSchema.pre("save", function(next) {
  if (this.expiryDate < new Date()) {
    this.status = "expired";
  }
  next();
});

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);
export default PromoCode;