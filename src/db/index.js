// import dotenv from "dotenv";
import mongoose from "mongoose";
// dotenv.config();
import { MONGODB_URL } from "../constants.js"

//load environment variables from .env file
// console.log("Mongo URL:", "mongodb+srv://Ritesh:Rohit1234@ritesh.mtblr1d.mongodb.net");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Message from db folder : DB connected successfully!")
  } catch (error) {
    console.error("DB Errro", error);
    process.exit(1);
  }
}

export default connectDB;

// const connectDB = async () => {
//   try {
//     const connection = await mongoose.connect(
//       `url`
//     );
//     console.log("MongoDB connected:", connection.connection.host);
//   } catch (error) {
//     console.error("MongoDB connection failed:", error);
//     process.exit(1);
//   }
// };

// connectDB();