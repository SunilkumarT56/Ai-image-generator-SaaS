import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  const {token} = req.headers;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // const user = await User.findById(decode.id).select('-password');
    req.body.userId = decode.id;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid token",
    });
  }
};
