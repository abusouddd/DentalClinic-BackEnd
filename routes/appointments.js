import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", adminAuth, async (req, res) => {
  const { doctorId, service, date, time } = req.body || {};
  const adminId = req.headers["x-admin-id"];

  if (!doctorId || !service || !date || !time || !adminId) {
    return res.status(400).json({
      message: "doctorId, service, date, time, adminId are required",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO Appointment (DoctorID, Service, Date, Time, AdminID, IsAvailable)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING *`,
      [doctorId, service, date, time, adminId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/available", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.appointmentid, a.service, a.date, a.time, a.isavailable,
              d.doctorid, d.name AS doctorname, d.role
       FROM Appointment a
       JOIN Doctor d ON a.doctorid = d.doctorid
       WHERE a.isavailable = TRUE
       ORDER BY a.date ASC, a.time ASC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch available slots" });
  }
});

export default router;
