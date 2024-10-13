import jwt, { JwtPayload } from "jsonwebtoken";
import { USER_ROLE, USER_STATUS } from "../modules/User/user.constant";

export const createToken = (
  jwtPayload: {
    _id?: string;
    name: string;
    email: string;
    profilePicture?: string;
    mobileNumber?: string;
    role: keyof typeof USER_ROLE;
    status: keyof typeof USER_STATUS;
    verified: boolean; // New field
    followers: string[]; // New field
    following: string[]; // New field
    premiumUser: boolean; // New field
  },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    throw new Error("You are not authorized!");
  }
};
