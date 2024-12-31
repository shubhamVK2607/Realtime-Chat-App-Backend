import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = mongoose.connect(process.env.DATABASE_URI);

export default connectDB;
