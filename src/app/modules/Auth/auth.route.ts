import express from "express";

import { AuthControllers } from "./auth.controller";

const router = express.Router();

router.post(
  "/register",
  // validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.registerUser
);
router.post(
  "/login",
  // validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
);

router.post(
  "/change-password",
  // auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  // validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword
);

router.post(
  "/refresh-token",
  // validateRequestCookies(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

export const AuthRoutes = router;
