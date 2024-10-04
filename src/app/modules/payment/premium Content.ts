import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import AppError from "../../utils/errors/AppError";
import { Post } from "../Posts/post.model";

export const createPost = catchAsync(async (req, res) => {
  const user = req.user;

  // Check if the user is allowed to create premium content
  if (req.body.isPremiumContent && !user.premiumUser) {
    throw new AppError(403, "Only premium users can create premium content.");
  }

  const post = await Post.create({
    ...req.body,
    author: user._id,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post created successfully",
    data: post,
  });
});
