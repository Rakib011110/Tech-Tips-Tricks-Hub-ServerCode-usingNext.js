import express from "express";
import {
  getFollowers,
  getFollowing,
  handleFollowUser,
  handleUnfollowUser,
  UserControllers,
} from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";

const router = express.Router();

export const UserRoutes = router;

router.post(
  "/create-user",
  auth(USER_ROLE.ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);
router.patch(
  "/:id",
  // auth(USER_ROLE.USER),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUserProfile
);

router.patch(
  "/verify/:id",
  auth(USER_ROLE.ADMIN), // Only admin can verify users
  UserControllers.updateUserVerification
);

router.patch(
  "/status/:id",
  auth(USER_ROLE.ADMIN), // Only admin can update user status
  UserControllers.updateUserStatus
);

router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getSingleUser);
router.post("/follow/:id", auth(USER_ROLE.USER), handleFollowUser);
router.post("/unfollow/:id", auth(USER_ROLE.USER), handleUnfollowUser);
// Get followers list
router.get("/followers/:userId", getFollowers);

// Get following list
router.get("/following/:userId", getFollowing);
// In src/routes/user.routes.ts
router.delete(
  "/:id",
  auth(USER_ROLE.ADMIN), // Only admin can delete users
  UserControllers.deleteUser
);
