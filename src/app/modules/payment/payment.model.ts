// User model (user.model.ts)
import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema({
  cardBrand: { type: String, required: true },
  last4: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  // Existing fields...
  premiumUser: { type: Boolean, default: false },
  paymentHistory: [
    {
      amount: { type: Number, required: true },
      paymentMethod: paymentMethodSchema,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  currentPaymentMethod: paymentMethodSchema,
});

export const User = mongoose.model("User", userSchema);
