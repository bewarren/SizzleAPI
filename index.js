// if (process.env.NODE_ENV !== "production") {

// }
import "dotenv/config";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import methodOverride from "method-override";
import http from "http";
import https from "https";
import fs from "fs";

import User from "./models/users.js";

import userRoutes from "./routes/users.js";
import transactionRoutes from "./routes/transactions.js";

const { connect } = mongoose;

const key = fs.readFileSync("./localhost-key.pem", "utf8");
const cert = fs.readFileSync("./localhost.pem", "utf8");

const dbURL = process.env.DB_URL;
// "mongodb://localhost:27017/users";
connect(dbURL)
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

const httpServer = http.createServer(app);
const httpsServer = https.createServer({ key: key, cert: cert }, app);

httpServer.listen(8080, () => {
  console.log("Http server listening on port 8080");
});

httpsServer.listen(8443, () => {
  console.log("Https server listening on port 8443");
});
