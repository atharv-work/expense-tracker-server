const express = require("express");
const transactionsMeta = require("../models/TransactionsMeta");
const authMiddleware = require('../authorizationMiddleware');

const router = express.Router();

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const user_email = req.user.user_email
    
    const { bal, totalDebit } = req.body;
    if (!user_email) {
      return res.status(400).json({ message: "user_email is required" });
    }
    const meta = await transactionsMeta.findOneAndUpdate(
      { user_email }, // filter by user
      {
        $set: {
          bal,
          totalDebit,
          user_email,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json(meta);
  } catch (err) {
    res.status(500).send("Error updating meta", err);
  }
});

router.get("/",authMiddleware, async (req, res) => {
  try {
    const user_email  = req.user.user_email;
    if (!user_email) {
      return res.status(400).json({ message: "user_email is required" });
    }
    const meta = await transactionsMeta.findOne({ user_email });
    if (!meta && user_email) {
      return res.status(200).json({ message: "No data found" });
    } else if (!meta) {
      return res.status(404).json({ message: "No meta information available" });
    }
    res.status(200).json(meta);
  } catch (err) {
    res.status(500).json({ error: "Error fetching meta" });
  }
});

module.exports = router;