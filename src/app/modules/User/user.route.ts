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

router.get("/", UserControllers.getAllUsers);
router.get("/:id", UserControllers.getSingleUser);
router.post("/follow", auth(USER_ROLE.USER), handleFollowUser);
router.post("/unfollow", auth(USER_ROLE.USER), handleUnfollowUser);
// Get followers list
router.get("/followers/:userId", auth(USER_ROLE.USER), getFollowers);

// Get following list
router.get("/following/:userId", auth(USER_ROLE.USER), getFollowing);
