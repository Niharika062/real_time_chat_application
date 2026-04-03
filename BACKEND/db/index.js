import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// connectDB is a constant asyn function always
// DB connect fun always in try-catch

const connectDB = async () => {
  try 
  {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );
    console.log("MONGODB connected !!");
  } 
  catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB ;