import express from "express";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "../services/usersApi.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("auth/login", { errors: [], form: { email: "" } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail((email || "").trim().toLowerCase());

  if (!user) return res.status(401).render("auth/login", { errors: ["Invalid credentials"], form: { email } });

  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).render("auth/login", { errors: ["Invalid credentials"], form: { email } });

  req.session.user = { id: user.id, email: user.email, name: user.name };
  res.redirect("/quotes");
});

router.get("/register", (req, res) => {
  res.render("auth/register", { errors: [], form: { email: "", name: "" } });
});

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).render("auth/register", { errors: ["Email and password required"], form: { email, name } });
  }

  const existing = await findUserByEmail(email);
  if (existing) return res.status(409).render("auth/register", { errors: ["User already exists"], form: { email, name } });

  const passwordHash = await bcrypt.hash(password, 10);

  await createUser({
    email: email.trim().toLowerCase(),
    name: (name || "").trim(),
    passwordHash,
    createdAt: new Date().toISOString()
  });

  res.redirect("/auth/login");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/auth/login"));
});

export default router;
