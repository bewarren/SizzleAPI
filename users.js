import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const User = model("User", userSchema);

export default User;
