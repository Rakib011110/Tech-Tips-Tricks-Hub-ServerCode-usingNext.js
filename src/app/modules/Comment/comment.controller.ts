import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { commentServices } from "./comment.service";
import AppError from "../../utils/errors/AppError";
import mongoose from "mongoose";

export const createComment = catchAsync(async (req, res) => {
  const { content, postId } = req.body;
  const userId = req.user._id;

  // Validate that postId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new AppError(400, "Invalid Post ID");
  }

  // Proceed to create comment if postId is valid
  const comment = await commentServices.createCommentInDB({
    content,
    author: userId,
    post: postId,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment created successfully",
    data: comment,
  });
});

export const getCommentsForPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const comments = await commentServices.getCommentsForPostInDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comments retrieved successfully",
    data: comments,
  });
});
