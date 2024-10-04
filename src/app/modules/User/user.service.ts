import mongoose from "mongoose";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(User.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  return result;
};

const updateUserProfileDB = async (
  userId: string,
  updatePayload: Partial<TUser>
) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, {
    new: true, // Return the updated user
    runValidators: true, // Ensure validation is applied
  });

  return updatedUser;
};
const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);

  return user;
};
// ---------------FLOWER CODE HERE----------
export const followUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) throw new Error("User not found");

  // Check if already following
  if (user.following.includes(targetUserId)) {
    throw new Error("Already following this user");
  }

  // Add target user to the following list
  user.following.push(new mongoose.Types.ObjectId(targetUserId));

  // Add current user to the followers list of the target user
  targetUser.followers.push(new mongoose.Types.ObjectId(userId));

  await user.save();
  await targetUser.save();
  return user;
};

export const unfollowUser = async (userId: string, targetUserId: string) => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) throw new Error("User not found");

  // Remove target user from the following list
  user.following = user.following.filter(
    (followingId) => followingId.toString() !== targetUserId
  );

  // Remove current user from the followers list of the target user
  targetUser.followers = targetUser.followers.filter(
    (followerId) => followerId.toString() !== userId
  );

  await user.save();
  await targetUser.save();
  return user;
};
export const getFollowersList = async (userId: string) => {
  const user = await User.findById(userId).populate("followers", "name email"); // Populate followers with their name and email
  if (!user) throw new Error("User not found");
  return user.followers;
};

export const getFollowingList = async (userId: string) => {
  const user = await User.findById(userId).populate("following", "name email"); // Populate following with their name and email
  if (!user) throw new Error("User not found");
  return user.following;
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserProfileDB,
  followUser,
  unfollowUser,
};
