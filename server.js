import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import db from "./db.js";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "DentalClinic API running" });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

db.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
  });
