import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../services/usersApi.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).json({ message: "User already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await createUser({
    email: email.trim().toLowerCase(),
    name: (name || "").trim(),
    passwordHash,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ id: user.id, email: user.email, name: user.name });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail((email || "").trim().toLowerCase());
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

export default router;
