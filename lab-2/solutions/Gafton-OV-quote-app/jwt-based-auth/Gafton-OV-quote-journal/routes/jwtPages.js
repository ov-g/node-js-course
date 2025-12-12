import express from "express";

const router = express.Router();

// optional: /jwt -> /jwt/quotes
router.get("/", (req, res) => res.redirect("/jwt/quotes"));

router.get("/login", (req, res) => {
  res.render("jwt/login");
});

router.get("/register", (req, res) => {
  res.render("jwt/register");
});

router.get("/quotes", (req, res) => {
  // Protected on the client: if no token -> redirect to /jwt/login
  res.render("jwt/quotes");
});

export default router;
