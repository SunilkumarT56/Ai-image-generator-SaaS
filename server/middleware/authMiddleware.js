import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDk3OGUyZWM0OGNlNDc2MzVlYjE3NyIsImlhdCI6MTc1OTA4MzYxNiwiZXhwIjoxNzU5MTcwMDE2fQ.sA_stnj5fRvZ8PMc8u8ZsxQwvyrL20Cn4XdgP0k3eGI' ;
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
