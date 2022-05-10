import express from "express";
const router = express.Router();
import User from "../models/users.js";
import passport from "passport";

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { email, userName: username, firstName, lastName, password } = req.body;

  const user = new User({ email, username, firstName, lastName });
  const registeredUser = await User.register(user, password);
  res.send(registeredUser);
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  const user = User.findOne({ username: req.body.username }, (err, user) => {
    res.send(user);
  });
});

export default router;
