import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Database Connection Successful ✅");
  } catch (error) {
    console.log("Database connection failed! ❌"); 
  }
};

export default connectDB;
