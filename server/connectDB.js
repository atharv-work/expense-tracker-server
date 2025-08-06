// connectDB.js
const dotenv = require("dotenv");

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config(); // defaults to .env
}

const mongoose = require("mongoose");
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log("✅ MongoDB already connected.");
    return;
  }

  try {
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "expense-tracker",
    });

    isConnected = true;
    console.log("✅ MongoDB connected!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit the process on failure
  }
}

module.exports = connectDB;
