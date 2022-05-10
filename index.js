import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";

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

passport.use(new LocalStrategy(User.authenticate())); // hi passport, use local strategy on User Model

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/users", userRoutes);

app.get("/fakeMakeUser", async (req, res) => {
  const user = new User({
    email: "test2@gmail.com",
    username: "beeeen2",
    firstName: "Ben2",
    lastName: "Warren2",
  });
  const newUser = await User.register(user, "chicken");
  res.send(newUser);
});

app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  res.send(user);
});

app.post("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.send(user);
});

app.post("/payment/:toId/:fromId", async (req, res) => {
  const { toId, fromId } = req.params;
  const { amount } = req.body;

  // const session = await User.startSession();
  // session.startTransaction();

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

    // await session.commitTransaction();
    // session.endSession();
    res.send({ to: to, from: from, amount: amount });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
