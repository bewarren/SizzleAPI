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
});

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
