import mongoose from "mongoose";

const MONGODB =
  process.env.MONGODB || "mongodb://localhost:27017/miles-and-smiles";

export default async function connectDB() {
  try {
    await mongoose.connect(MONGODB);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB: " + err);
    process.exit(1);
  }
}
