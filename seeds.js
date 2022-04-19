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

// const user = new User({ name: "Josh" });

// user
//   .save()
//   .then((p) => console.log(p))
//   .catch((err) => {
//     console.log("Error");
//     console.log(err);
//   });

User.insertMany([
  { name: "Josh ", balance: 100 },
  { name: "Ben S", balance: 200 },
  { name: "Jason", balance: 75 },
  { name: "Calum", balance: 25 },
  { name: "Senzo", balance: 225 },
]).then((data) => {
  console.log("It worked");
  console.log(data);
});
