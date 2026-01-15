import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { patientName, patientPhone, patientEmail, service, notes, appointmentId, userId } =
    req.body || {};

  if (!patientName || !patientPhone || !patientEmail || !service || !appointmentId || !userId) {
    return res.status(400).json({
      message:
        "patientName, patientPhone, patientEmail, service, appointmentId, userId are required",
    });
  }

  try {
    const slot = await db.query(
      "SELECT isavailable FROM Appointment WHERE appointmentid = $1",
      [appointmentId]
    );

    if (slot.rows.length === 0) {
      return res.status(404).json({ message: "Appointment slot not found" });
    }

    if (slot.rows[0].isavailable === false) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    const booking = await db.query(
      `INSERT INTO BookedAppointment
        (PatientName, PatientPhone, PatientEmail, Service, Notes, Status, IsCancelled, AppointmentID, UserID)
       VALUES ($1,$2,$3,$4,$5,'Pending',FALSE,$6,$7)
       RETURNING *`,
      [patientName, patientPhone, patientEmail, service, notes || "", appointmentId, userId]
    );

    await db.query("UPDATE Appointment SET IsAvailable = FALSE WHERE appointmentid = $1", [
      appointmentId,
    ]);

    res.status(201).json(booking.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
});

// ADMIN: list all bookings
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.bookedappointmentid,
              b.patientname, b.patientphone, b.patientemail, b.service, b.notes, b.status,
              b.appointmentid, b.userid,
              a.date, a.time,
              d.name AS doctorname, d.role
       FROM BookedAppointment b
       JOIN Appointment a ON b.appointmentid = a.appointmentid
       JOIN Doctor d ON a.doctorid = d.doctorid
       ORDER BY b.bookedappointmentid DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
});

router.patch("/:id/status", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!status) {
    return res.status(400).json({ message: "status is required" });
  }

  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return res.status(400).json({ message: "status must be Approved, Rejected, or Pending" });
  }

  try {
    const b = await db.query(
      "SELECT appointmentid FROM BookedAppointment WHERE bookedappointmentid = $1",
      [id]
    );

    if (b.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const appointmentId = b.rows[0].appointmentid;

    const adminId = req.headers["x-admin-id"];

    const result = await db.query(
      `UPDATE BookedAppointment
       SET status = $1, adminid = $2
       WHERE bookedappointmentid = $3
       RETURNING *`,
      [status, adminId, id]
    );

    if (status === "Rejected") {
      await db.query("UPDATE Appointment SET IsAvailable = TRUE WHERE appointmentid = $1", [
        appointmentId,
      ]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const b = await db.query(
      "SELECT appointmentid FROM BookedAppointment WHERE bookedappointmentid = $1",
      [id]
    );

    if (b.rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const appointmentId = b.rows[0].appointmentid;

    await db.query("DELETE FROM BookedAppointment WHERE bookedappointmentid = $1", [id]);

    await db.query("UPDATE Appointment SET IsAvailable = TRUE WHERE appointmentid = $1", [
      appointmentId,
    ]);

    res.json({ message: "Deleted booking and freed slot" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking", error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT b.bookedappointmentid,
              b.patientname, b.patientphone, b.patientemail, b.service, b.notes, b.status,
              b.appointmentid, b.userid,
              a.date, a.time,
              d.name AS doctorname, d.role
       FROM BookedAppointment b
       JOIN Appointment a ON b.appointmentid = a.appointmentid
       JOIN Doctor d ON a.doctorid = d.doctorid
       WHERE b.userid = $1
       ORDER BY b.bookedappointmentid DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
});

export default router;
