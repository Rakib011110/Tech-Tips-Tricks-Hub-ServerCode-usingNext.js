// backend/routes/paymentRoutes.ts
import express from "express";
import { createPaymentIntent } from "./paymentController";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

// POST route for creating a payment intent
router.post(
  "/create-payment-intent",
  auth(USER_ROLE.USER),
  createPaymentIntent
);

export const paymentRoute = router;
