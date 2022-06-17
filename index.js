import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import methodOverride from "method-override";

import User from "./models/users.js";

import userRoutes from "./routes/users.js";

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

app.post("/payment/:toId/:fromId", async (req, res) => {
  const { toId, fromId } = req.params;
  const { amount, routeName } = req.body;

  // const session = await User.startSession();
  // session.startTransaction();

  console.log(routeName);

  try {
    const opts = { new: true };

    const from = await User.findOneAndUpdate(
      { _id: fromId },
      { $inc: { balance: -amount } },
      opts
    );

    const to = await User.findOneAndUpdate(
      { _id: toId },
      { $inc: { balance: amount } },
      opts
    );

    const people = await User.find({});

    // await session.commitTransaction();
    // session.endSession();
    res.send({ to: to, from: from, amount: amount, people: people });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
