// models/Counter.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    default: 0
  }
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;