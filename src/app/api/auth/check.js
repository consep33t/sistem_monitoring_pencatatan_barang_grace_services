// pages/api/auth/check.js
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Valid" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired" });
  }
}
