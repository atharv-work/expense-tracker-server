const express = require("express");
const bcrypt = require("bcrypt");
const userDetails = require("../models/UserDetails");
const jwt = require("jsonwebtoken");
const successResponseOnApiCall = require("../responses/success-response");
const router = express.Router();
const authMiddleware = require("../authorizationMiddleware");

router.get("/", async (req, res) => {
  try {
    const transaction = await userDetails.find();
    res.send(transaction);
  } catch (err) {
    res.status(500).send("Error fetching transactions", err);
  }
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    const userResult = await userDetails.findOne({
      $or: [{ user_email: userName.toLowerCase() }, { user_number: userName }],
    });
    if (!userResult) {
      return res.status(404).send("User not found");
    }
    if (!(await bcrypt.compare(password, userResult.user_password))) {
      return res.status(401).send("Incorrect password");
    }
    const token = jwt.sign(
      {
        id: userResult._id,
        user_email: userResult.user_email,
        first_name: userResult.first_name,
        last_name: userResult.last_name,
        user_number: userResult.user_number,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "30m",
      }
    );
    res.send(successResponseOnApiCall(token));
  } catch (err) {
    res.status(500).send("Error fetching user details", err);
  }
});

router.post("/", async (req, res) => {
  try {
    if (req.body.user_email) {
      req.body.user_email = req.body.user_email.toLowerCase();
    }
    const newUserDetails = new userDetails(req.body);
    const hashedPassword = await bcrypt.hash(newUserDetails.user_password, 10);
    newUserDetails.user_password = hashedPassword;
    const saved = await newUserDetails.save();
    res.status(200).json(saved);
  } catch (err) {
    const errorMessage = err?.errorResponse && err?.errorResponse?.errmsg;
    res.status(500).json({
      message: "Error saving transaction",
      error: err.errorResponse.errmsg.includes("user_email_1 dup key")
        ? "Email already exists"
        : errorMessage.includes("user_number_1 dup key")
        ? "Number already registered"
        : err.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await userDetails.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: "Error deleting transaction", err });
  }
});

router.put("/updateProfile/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user.id !== id) {
      return res.status(403).json({
        message: "Unauthorized: Cannot update another user's profile",
      });
    }

    const { first_name, last_name, user_email, user_number } = req.body;
    const updateFields = {};
    if (first_name) updateFields.first_name = first_name;
    if (last_name) updateFields.last_name = last_name;
    if (user_email) updateFields.user_email = user_email;
    if (user_number) updateFields.user_number = user_number;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }
    const updated = await userDetails.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User profile updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: "Error updating user profile", err });
  }
});

module.exports = router;
