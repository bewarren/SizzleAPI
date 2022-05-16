import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  to: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
