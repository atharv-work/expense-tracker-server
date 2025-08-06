const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB");
const transactionsRoutes = require("./handler/transactions-handler");
const metaRoutes = require("./handler/transactions-meta-handler");
const userDetailsRoutes = require("./handler/user-details-handler");
const jwtTokenRoutes = require("./handler/jwt-token-handler");
const imageRoutes = require("./handler/image-handler");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config(); // defaults to .env
}
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Connect to MongoDB
connectDB();
app.use("/transactions", transactionsRoutes);
app.use("/meta", metaRoutes);
app.use("/userDetails", userDetailsRoutes);
app.use("/fetchToken", jwtTokenRoutes);
app.use("/imageService", imageRoutes);
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// Start server
app.listen(process.env.PORT || 5051, "0.0.0.0");
