import express from "express";
import {
  getAllQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote
} from "../services/quotesApi.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = express.Router();

function validateQuote({ text, author }) {
  const errors = [];
  if (!text || text.trim().length < 3) errors.push("Quote text must be at least 3 characters.");
  if (!author || author.trim().length < 2) errors.push("Author must be at least 2 characters.");
  return errors;
}

// LIST
router.get("/", async (req, res, next) => {
  try {
    const quotes = await getAllQuotes();
    res.render("quotes/index", { quotes });
  } catch (e) {
    next(e);
  }
});

// NEW FORM
router.get("/new", requireLogin, (req, res) => {
  res.render("quotes/new", { errors: [], form: { text: "", author: "" } });
});

// CREATE
router.post("/", requireLogin, async (req, res, next) => {
  try {
    const { text, author } = req.body;
    const errors = validateQuote({ text, author });

    if (errors.length) {
      return res.status(400).render("quotes/new", { errors, form: { text, author } });
    }

    await createQuote({
      text: text.trim(),
      author: author.trim(),
      createdAt: new Date().toISOString()
    });

    res.redirect("/quotes");
  } catch (e) {
    next(e);
  }
});

// SHOW
router.get("/:id", async (req, res, next) => {
  try {
    const quote = await getQuoteById(req.params.id);
    res.render("quotes/show", { quote });
  } catch (e) {
    next(e);
  }
});

// EDIT FORM
router.get("/:id/edit", requireLogin, async (req, res, next) => {
  try {
    const quote = await getQuoteById(req.params.id);
    res.render("quotes/edit", { quote, errors: [] });
  } catch (e) {
    next(e);
  }
});

// UPDATE
router.put("/:id", requireLogin, async (req, res, next) => {
  try {
    const { text, author } = req.body;
    const errors = validateQuote({ text, author });

    const quote = await getQuoteById(req.params.id);

    if (errors.length) {
      return res.status(400).render("quotes/edit", {
        errors,
        quote: { ...quote, text, author }
      });
    }

    await updateQuote(req.params.id, {
      ...quote,
      text: text.trim(),
      author: author.trim()
    });

    res.redirect(`/quotes/${req.params.id}`);
  } catch (e) {
    next(e);
  }
});

// DELETE
router.delete("/:id", requireLogin, async (req, res, next) => {
  try {
    await deleteQuote(req.params.id);
    res.redirect("/quotes");
  } catch (e) {
    next(e);
  }
});

export default router;
