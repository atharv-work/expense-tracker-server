const express = require("express");
const transactions = require("../models/Transactions");
const router = express.Router();
const authMiddleware = require("../authorizationMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  const userEmail = req.user.user_email; // extracted from JWT
  try {
    const transaction = await transactions.find({ user_email: userEmail });
    res.send(transaction);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error fetching transactions", error: err });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const userEmail = req.user.user_email;
  try {
    const newTransaction = new transactions({
      ...req.body,
      user_email: userEmail,
    });
    const saved = await newTransaction.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).send("Error saving transaction", err);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await transactions.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: "Error deleting transaction", err });
  }
});

module.exports = router;
