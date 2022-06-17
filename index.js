import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import methodOverride from "method-override";

import User from "./models/users.js";
import Transaction from "./models/transactions.js";

import userRoutes from "./routes/users.js";
import transactionRoutes from "./routes/transactions.js";

const { connect } = mongoose;

connect("mongodb://localhost:27017/users")
  .then(() => {
    console.log("Mongo Connection");
  })
  .catch((err) => {
    console.log("OH NO MONGO ERROR");
    console.log(err);
  });

const app = express();

app.use(cors());

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy()); // hi passport, use local strategy on User Model

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);

app.listen(8080, () => {
  console.log("listening on port 8080");
});
