import express from "express";
const router = express.Router();
import User from "../models/users.js";
import passport from "passport";

router.get("/", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  // const user = await User.findOne({ _id: id });
  // res.send(user);
  res.send("HI");
});

router.post("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.send(user);
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { email, userName: username, firstName, lastName, password } = req.body;

  const user = new User({ email, username, firstName, lastName });
  const registeredUser = await User.register(user, password);
  res.send(registeredUser);
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const user = await User.findOne(
    { username: req.body.username },
    (err, user) => {
      res.send(user);
    }
  );
});

export default router;
