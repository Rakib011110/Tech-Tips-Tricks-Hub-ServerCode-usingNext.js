/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./user.constant"; // Removed USER_STATUS as we are not using it

export type TUser = {
  _id?: string;
  name: string;
  role: keyof typeof USER_ROLE;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  status: keyof typeof USER_STATUS;
  profilePicture?: string;
  mobileNumber?: string;
  verified: boolean;
  followers: string[];
  following: string[];
  posts: string[];
  createdAt?: Date;
  updatedAt?: Date;
  premiumUser: boolean;
  completePayment: number; // New field for tracking user payments
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
