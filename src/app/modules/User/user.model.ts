/* eslint-disable no-useless-escape */
import bcryptjs from "bcryptjs";
import mongoose, { Schema, model } from "mongoose";
import config from "../../config";
import { USER_ROLE, USER_STATUS } from "./user.constant";
import { IUserModel, TUser } from "./user.interface";

const userSchema = new Schema<TUser, IUserModel>(
  {
    name: {
      type: String, // Changed from 'name' to 'username'
      required: true,
    },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      required: true,
    },
    completePayment: {
      type: Number,
      default: 0, // Default is 0 for new users
    },
    email: {
      type: String,
      required: true,
      // validate email
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: Object.keys(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    premiumUser: { type: Boolean, default: false },
    verified: {
      type: Boolean,
      default: false,
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [
      { type: Schema.Types.ObjectId, ref: "Post" }, // Array of post IDs
    ],
  },

  {
    timestamps: true,
    virtuals: true,
  }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next(); // Only hash if the password is modified
  user.password = await bcryptjs.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// Post-save hook to ensure password is not sent in the response
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password"); // Ensure password is fetched for comparison
};

// Static method to compare passwords
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

// Static method to check if JWT was issued before the password was changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// Create and export the user model
export const User = model<TUser, IUserModel>("User", userSchema);
