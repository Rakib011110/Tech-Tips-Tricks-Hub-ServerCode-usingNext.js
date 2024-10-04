import Stripe from "stripe";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { User } from "../User/user.model"; // Import User model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-09-30.acacia",
});

export const createPaymentIntent = catchAsync(async (req, res) => {
  const userId = req.user._id; // User id from authenticated request
  const { amount } = req.body;

  // Create a PaymentIntent with the specified amount (in cents)
  const paymentIntent = await stripe.paymentIntents.create({
    amount, // Amount in cents, $20 => 2000
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  // Mark the user as a premium user
  const user = await User.findById(userId);
  if (user) {
    user.premiumUser = true;
    await user.save();
  }

  // Send response with client secret for front-end to confirm payment
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment intent created successfully, user is now a premium user.",
    data: { clientSecret: paymentIntent.client_secret },
  });
});
