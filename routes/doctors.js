import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT "DoctorID" AS doctorid, "Name" AS name, "Role" AS role
       FROM "Doctor"
       ORDER BY "DoctorID" ASC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
