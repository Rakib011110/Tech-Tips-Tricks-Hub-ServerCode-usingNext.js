import httpStatus from "http-status";
import {
  followUser,
  getFollowersList,
  getFollowingList,
  unfollowUser,
  UserServices,
} from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: user,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const updatedUser = await UserServices.updateUserProfileDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile Updated Successfully",
    data: updatedUser,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});
// ---------------------

export const handleFollowUser = catchAsync(async (req, res) => {
  const { userId, targetUserId } = req.body;

  const updatedUser = await followUser(userId, targetUserId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Successfully followed the user",
    data: updatedUser,
  });
});

export const handleUnfollowUser = catchAsync(async (req, res) => {
  const { userId, targetUserId } = req.body;

  const updatedUser = await unfollowUser(userId, targetUserId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Successfully unfollowed the user",
    data: updatedUser,
  });
});
// Get followers list
export const getFollowers = catchAsync(async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed in params

  const followers = await getFollowersList(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Followers list retrieved successfully",
    data: followers,
  });
});

// Get following list
export const getFollowing = catchAsync(async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed in params

  const following = await getFollowingList(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Following list retrieved successfully",
    data: following,
  });
});
export const UserControllers = {
  getSingleUser,
  updateUserProfile,
  userRegister,
  getAllUsers,
};
