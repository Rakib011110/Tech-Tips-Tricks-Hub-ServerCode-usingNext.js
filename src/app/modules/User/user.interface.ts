/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./user.constant"; // Removed USER_STATUS as we are not using it

export type TUser = {
  _id?: string;
  name: string; // Changed from 'name' to 'username'
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
  premiumUser: boolean; // New field to indicate premium status
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
