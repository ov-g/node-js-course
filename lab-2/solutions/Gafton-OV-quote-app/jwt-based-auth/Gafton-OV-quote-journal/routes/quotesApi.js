import express from "express";
import { requireJwt } from "../middleware/requireJwt.js";
import { getAllQuotes, getQuoteById, createQuote, updateQuote, deleteQuote } from "../services/quotesApi.js";

const router = express.Router();

router.get("/", requireJwt, async (req, res) => {
  const quotes = await getAllQuotes();
  res.json(quotes);
});

router.post("/", requireJwt, async (req, res) => {
  const { text, author } = req.body;
  const created = await createQuote({ text, author, createdAt: new Date().toISOString() });
  res.status(201).json(created);
});

router.put("/:id", requireJwt, async (req, res) => {
  const old = await getQuoteById(req.params.id);
  const updated = await updateQuote(req.params.id, { ...old, ...req.body });
  res.json(updated);
});

router.delete("/:id", requireJwt, async (req, res) => {
  await deleteQuote(req.params.id);
  res.status(204).send();
});

export default router;
