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

router.post("/request/:toId/:fromId", async (req, res) => {
  const { toId, fromId } = req.params;
  const { amount } = req.body;

  try {
    const opts = { new: true };

    const from = await User.findById(fromId);
    const to = await User.findById(toId);

    const date = new Date();

    const transaction = new Transaction({
      amount: amount,
      date: date,
      isCompleted: false,
    });

    transaction.to = to;
    transaction.from = from;

    transaction.save().catch((err) => {
      console.log("Error");
      console.log(err);
    });

    // await session.commitTransaction();
    // session.endSession();
    res.send({ to: to, from: from, amount: amount });
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    throw error;
  }
});

router.put("/settle/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  try {
    const opts = { new: true };

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        isCompleted: true,
      },
      opts
    );

    const from = await User.findByIdAndUpdate(
      transaction.from._id,
      { $inc: { balance: -transaction.amount } },
      opts
    );

    const to = await User.findByIdAndUpdate(
      transaction.to._id,
      { $inc: { balance: transaction.amount } },
      opts
    );

    const people = await User.find({});
    const transactions = await Transaction.find({});

    res.send({
      to: to,
      from: from,
      amount: transaction.amount,
      people: people,
      transactions: transactions,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
});

router.post("/:toId/:fromId", async (req, res) => {
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

    const date = new Date();

    const transaction = new Transaction({
      amount: amount,
      date: date,
      isCompleted: true,
    });

    transaction.to = to;
    transaction.from = from;

    const people = await User.find({}); // need to update all balances

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
