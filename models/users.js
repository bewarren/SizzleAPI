import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    default: 0,
    min: 0,
  },
});

// want transactions linked here
// want pending, completed, and rejected transactions

userSchema.plugin(passportLocalMongoose);

const User = model("User", userSchema);

export default User;
