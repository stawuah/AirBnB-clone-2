import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const connectDB = () => {
  mongoose.Promise;
  mongoose.connect(process.env.MONGO_URL);
  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  db.once("open", () => {
    console.log("MONGO DB CONNECTED ");
  });
};

export default connectDB;
