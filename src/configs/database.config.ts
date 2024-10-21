// src/config/database.config.ts
import mongoose from "mongoose";
import { MONGODB_URI } from "./config"; // Adjust the import based on your structure

mongoose.connect(MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
});

export default mongoose.connection;
