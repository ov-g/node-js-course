import express from "express";
import methodOverride from "method-override";
import quotesRouter from "./routes/quotes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get("/", (req, res) => res.redirect("/quotes"));
app.use("/quotes", quotesRouter);

// simple error page
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { message: err?.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Web app running: http://localhost:${PORT}`);
});
