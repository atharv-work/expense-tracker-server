const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const successResponseOnApiCall = require("../responses/success-response");


router.get("/", async (req, res) => {
  try {
    const token = jwt.sign(
      {
        id: "1q23w45e67r8t90a1s234g56l",
        user_email: "sample@xyz.com",
        first_name: "sample",
        last_name:"demo",
        user_number: "1234567890",
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "30m",
      }
    );
    res.send(successResponseOnApiCall(token));
  } catch (err) {
    res.status(500).send("Error fetching transactions", err);
  }
});



module.exports = router;
