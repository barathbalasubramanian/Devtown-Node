if ((process.env.NODE_ENV = "!production")) {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

const initializePassport = require("./views/passport-config");

initializePassport(
  passport,
  (email) => details.find((user) => user.email === email),
  (id) => details.find((user) => user.id === id)
);

const details = [];

app.use(passport.initialize());
app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.get("/home", (req, res) => {
  res.render("home.ejs", { user: "Welcome" });
});

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true
  })
);

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    if (req.body.pass1 === req.body.pass2) {
      const hashpassword = await bcrypt.hash(req.body.pass2, 10);
      details.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashpassword
      });
      res.redirect("/");
    }
  } catch {
    res.redirect("/register");
  }
});

app.listen(8080);
