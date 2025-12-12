import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import quotesRouter from "./routes/quotes.js";
import authPages from "./routes/authPages.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(
  session({
    secret: "change_me_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.get("/", (req, res) => res.redirect("/quotes"));
app.use("/auth", authPages);
app.use("/quotes", quotesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", { message: err?.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Web app running: http://localhost:${PORT}`);
});
