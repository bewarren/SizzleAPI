import mongoose from "mongoose";

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

const user = new User({ name: "Ben" });

user
  .save()
  .then((p) => console.log(p))
  .catch((err) => {
    console.log("Error");
    console.log(err);
  });
