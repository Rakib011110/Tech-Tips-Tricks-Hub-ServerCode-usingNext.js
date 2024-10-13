import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { catchAsync } from "../utils/catchAsync";
import { USER_ROLE } from "../modules/User/user.constant";
import { verifyToken } from "../utils/verifyJWT";
import { User } from "../modules/User/user.model";
import AppError from "../utils/errors/AppError";

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Access denied. No token provided."
      );
    }

    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found in our system.");
    }

    const status = user?.status;

    if (status === "BLOCKED") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Access denied. Your account is blocked."
      );
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized. Password has been changed recently."
      );
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You do not have the necessary permissions."
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
