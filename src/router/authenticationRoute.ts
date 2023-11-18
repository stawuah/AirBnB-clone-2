import express from "express";
import {
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  RequestOtp,
} from "../controllers/authController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

/* ------------------- Suignup / Create Customer --------------------- */
router.post("/signup", CustomerSignUp);

/* ------------------- Login --------------------- */
router.post("/login", CustomerLogin);

/* ------------------- Authentication --------------------- */
router.use(Authenticate);

/* ------------------- Verify Customer Account --------------------- */
router.patch("/verify", CustomerVerify);

/* ------------------- OTP / request OTP --------------------- */
router.get("/otp", RequestOtp);

export { router as AuthRoute };
