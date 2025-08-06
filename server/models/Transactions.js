const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    desc: { type: String, required: true },
    cr: { type: Number, required: true },
    dr: { type: Number, required: true },
    user_email: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    collection: "transactions",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("transactions", transactionSchema);
