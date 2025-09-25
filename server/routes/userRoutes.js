import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazor,
  verifyRazorpay
} from "../controllers/userController.js";
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/credits", protect, userCredits);
router.post("/pay-razor",protect , paymentRazor)
router.post("/verify-razor" ,verifyRazorpay)

export default router;
