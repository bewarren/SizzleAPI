import mongoose from "mongoose";
const { connect, Schema, model } = mongoose;

connect("mongodb://localhost:27017/movieApp")
  .then(() => {
    console.log("Connection");
  })
  .catch((err) => {
    console.log("OH NO ERROR");
    console.log(err);
  });

// Schema
const movieSchema = new Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String,
});

// Model
const Movie = model("Movie", movieSchema);

// Movie.insertMany([
//   { title: "New Movie", year: 2022, score: 8.3, rating: "R" },
//   { title: "New Movie 2", year: 2027, score: 1.1, rating: "PG" },
//   { title: "New Movie 3", year: 2032, score: 10.0, rating: "A" },
// ]).then((data) => {
//   console.log("It worked");
//   console.log(data);
// });
