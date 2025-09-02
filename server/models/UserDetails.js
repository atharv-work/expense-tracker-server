const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    user_email: { type: String, required: true, unique: true },
    user_number: { type: String, unique: true },
    user_password: { type: String, required: true },
  },
  {
    collection: "userDetails",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("userDetails", userDetailsSchema);
