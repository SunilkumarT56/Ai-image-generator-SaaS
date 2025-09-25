import mongoose from "mongoose";
const { Schema, model , models}  = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  creditBalance: {
    type: Number,
    default: 5,
  },
});

const User = models.User || model("User", userSchema);

export default User;
