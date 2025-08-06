const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String},
    user_email: { type: String },
    user_number: { type: String },
    user_password: { type: String },    
  },
  {
    collection: "userDetails",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("userDetails", userDetailsSchema);
