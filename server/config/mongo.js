import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => {
    console.log("MongoDB initial connection failed:", error.message);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongo has connected successfully");
});
mongoose.connection.on("reconnected", () => {
  console.log("Mongo has reconnected");
});
mongoose.connection.on("error", (error) => {
  console.log("Mongo connection error:", error.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongo connection is disconnected");
});