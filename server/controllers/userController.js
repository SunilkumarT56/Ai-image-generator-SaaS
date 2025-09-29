import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import razorpay from "razorpay";
import Transaction from "../models/transactionModel.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        status: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // const {password , ...userData} = newUser._doc;
    const token = await generateToken(newUser._id);

    res.status(201).json({
      status: true,
      message: `${newUser.name} registered successfully`,
      token,
      user: {
        name: newUser.name,
      },
      credits: newUser.creditBalance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }
    const loggedUser = await User.findOne({ email });
    if (!loggedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      loggedUser.password
    );
    if (!isCorrectPassword) {
      return res.status(401).json({
        status: false,
        message: "Incorrect password",
      });
    } else {
      const token = await generateToken(loggedUser._id);
      res.status(200).json({
        status: true,
        message: "Logged in successfully",
        token,
        user: {
          name: loggedUser.name,
        },
        credits: loggedUser.creditBalance,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const userCredits = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    res.status(200).json({
      status: true,
      credits: user.creditBalance,
      message: "Credits fetched successfully",
      user: { name: user.name },
      credits: user.creditBalance,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong",
    });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentRazor = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const user = await User.findById(userId);

    if (!userId || !planId) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }
    let credits, plan, amount, date;
    switch (planId) {
      case "Basic":
        credits = 5;
        plan = "Basic";
        amount = 10;
        break;
      case "Advanced":
        credits = 50 ;
        plan = "Premium";
        amount = 100;
        break;
      case "Business":
        credits = 125;
        plan = "Enterprise";
        amount = 250;
        break;

      default:
        return res.status(400).json({
          status: false,
          message: "Invalid plan",
        });
    }
    date = Date.now();

    const transactionData = {
      userId,
      amount,
      plan,
      credits,
      date,
    };

    const newTransaction = await Transaction.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          status: false,
          message: "Something went wrong",
        });
      }
      res.status(200).json({
        status: true,
        order,
        message: "Order created successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "Something went wrong",
    });
  }
};

export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderinfo.status === "paid") {
      const transactionData = await Transaction.findById(orderinfo.receipt);
      if (transactionData.payment) {
        return res.status(400).json({
          status: false,
          message: "Payment already done",
        });
      }
      const userData = await User.findById(transactionData.userId);
      const creditBalance = userData.creditBalance + transactionData.credits;
      await User.findByIdAndUpdate(userData._id, { creditBalance });
      await Transaction.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });
      return res.status(200).json({
        status: true,
        message: "Payment done successfully",
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Payment failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "Something went wrong",
    });
  }
};

