export default function adminAuth(req, res, next) {
  const adminId = req.header("x-admin-id");

  if (!adminId) {
    return res.status(403).json({ message: "Admin access only" });
  }

  req.admin = { id: adminId };
  next();
}
