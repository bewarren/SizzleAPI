import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: false, // will need to change to true later
  },
});

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
