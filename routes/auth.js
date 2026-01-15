import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ message: "auth ok" });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "name, email, password are required",
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO "User" (Name, Email, Password)
       VALUES ($1, $2, $3)
       RETURNING UserID, Name, Email`,
      [name, email, password]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const result = await db.query(
    `SELECT UserID, Name, Email
     FROM "User"
     WHERE Email = $1 AND Password = $2`,
    [email, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json(result.rows[0]);
});

router.put("/update", async (req, res) => {
  const { userId, name, email, currentPassword, newPassword } = req.body || {};

  if (!userId || !name || !email) {
    return res.status(400).json({
      message: "userId, name, and email are required",
    });
  }

    // If user wants to change password (optional)
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "currentPassword is required to change password",
        });
      }

      const check = await db.query(
        `SELECT UserID
         FROM "User"
         WHERE UserID = $1 AND Password = $2`,
        [userId, currentPassword]
      );

      if (check.rows.length === 0) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const result = await db.query(
        `UPDATE "User"
         SET Name = $1, Email = $2, Password = $3
         WHERE UserID = $4
         RETURNING UserID, Name, Email`,
        [name, email, newPassword, userId]
      );

      return res.json(result.rows[0]);
    }

    const result = await db.query(
      `UPDATE "User"
       SET Name = $1, Email = $2
       WHERE UserID = $3
       RETURNING UserID, Name, Email`,
      [name, email, userId]
    );

    return res.json(result.rows[0]);
});

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  const result = await db.query(
    `SELECT AdminID, Email
     FROM Admin
     WHERE Email = $1 AND Password = $2`,
    [email, password]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  return res.json(result.rows[0]);
});

export default router;
