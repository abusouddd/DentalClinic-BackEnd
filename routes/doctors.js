import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT doctorid, name, role FROM doctor ORDER BY doctorid"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

export default router;
