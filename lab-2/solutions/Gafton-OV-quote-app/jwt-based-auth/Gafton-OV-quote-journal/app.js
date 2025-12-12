import dotenv from "dotenv";
import authApi from "./routes/authApi.js";
import quotesApi from "./routes/quotesApi.js";
import express from "express";
import methodOverride from "method-override";
import quotesRouter from "./routes/quotes.js";
import jwtPages from "./routes/jwtPages.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use("/jwt", jwtPages);
app.use(express.json()); // IMPORTANT for API requests
app.use("/api/auth", authApi);
app.use("/api/quotes", quotesApi);

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
