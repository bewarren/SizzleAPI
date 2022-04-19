import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";

import User from "./users.js";

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

app.get("/users", async (req, res) => {
  const users = await User.find({});
  console.log(users);
  res.send(users);
});

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  res.send(user);
});

app.post("/users/:id", async (req, res) => {
  const id = req.params.id;
  console.log(req.body);
  // console.log(res.json({ requestBody: req.body }));
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.send(user);
});

app.listen(3000, "10.20.2.149", () => {
  console.log("listening on port 3000");
});
