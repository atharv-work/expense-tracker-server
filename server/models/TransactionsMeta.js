const mongoose = require("mongoose");

const transactionMetaSchema = new mongoose.Schema(
  {
    user_email: { type: String, required: true },
    bal: { type: Number, required: true },
    totalDebit: { type: Number, required: true },
  },
  {
    collection: "transactionsMeta",
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("transactionsMeta", transactionMetaSchema);
