import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const transactionSchema = new Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
    enum: ["Basic", "Advanced", "Business"],
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
  },
  payment: {
    type: Boolean,
    default: false,
  },
});

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
