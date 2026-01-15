import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import db from "./db.js";

dotenv.config();

import authRoutes from "./routes/auth.js";
import doctorsRoutes from "./routes/doctors.js";
import appointmentsRoutes from "./routes/appointments.js";
import bookingsRoutes from "./routes/bookings.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("DentalClinic API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/bookings", bookingsRoutes);

db.connect()
  .then(() => {
    console.log("Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
