import express from "express";
const router = express.Router();
import User from "../models/users.js";
import Transaction from "../models/transactions.js";

import ObjectId from "mongoose";

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const transactions = await Transaction.find({
    $or: [{ to: id }, { from: id }],
  })
    .populate("to")
    .populate("from");

  res.send(transactions);
});

router.post("/:toId/:fromId", async (req, res) => {
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

    const date = new Date();

    const transaction = new Transaction({
      amount: amount,
      date: date,
    });

    transaction.to = to;
    transaction.from = from;

    transaction.save().catch((err) => {
      console.log("Error");
      console.log(err);
    });

    // await session.commitTransaction();
    // session.endSession();
    res.send({ to: to, from: from, amount: amount, people: people });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }
});

export default router;
