import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, async (req, res) => {
  const { doctorId, service, date, time } = req.body || {};
  const adminId = req.admin.id;

  if (!doctorId || !service || !date || !time) {
    return res.status(400).json({
      message: "doctorId, service, date, time are required",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO "Appointment" ("DoctorID", "Service", "Date", "Time", "AdminID", "IsAvailable")
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING *`,
      [doctorId, service, date, time, adminId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/available", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
         a."AppointmentID" AS "AppointmentID",
         a."DoctorID" AS "DoctorID",
         a."Service" AS "Service",
         a."Date" AS "Date",
         a."Time" AS "Time",
         a."IsAvailable" AS "IsAvailable",
         d."Name" AS "DoctorName",
         d."Role" AS "DoctorRole"
       FROM "Appointment" a
       JOIN "Doctor" d ON d."DoctorID" = a."DoctorID"
       WHERE a."IsAvailable" = TRUE
       ORDER BY a."Date" ASC, a."Time" ASC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
