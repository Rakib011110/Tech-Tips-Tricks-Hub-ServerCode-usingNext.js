import { TImageFiles } from "../../interfaces/image.interface";
import { postServices } from "./post.services";
import AppError from "../../utils/errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// Create a new Post
export const createPost = catchAsync(async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);
  if (!req.files || !req.files.postImages) {
    throw new AppError(400, "Please upload an image");
  }

  const post = await postServices.createPostIntoDB(
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post created successfully",
    data: post,
  });
});

// Update a Post
export const updatePost = catchAsync(async (req, res) => {
  const postId = req.params.id;

  const post = await postServices.updatePostInDB(
    postId,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: post,
  });
});

// Delete a Post
export const deletePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id; // Assuming JWT middleware attaches userId

  const post = await postServices.deletePostFromDB(postId, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: post,
  });
});

export const upvotePost = catchAsync(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new AppError(401, "User is not authenticated");
  }
  const { postId } = req.params;

  const post = await postServices.upvotePostInDB(postId, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post upvoted successfully",
    data: post,
  });
});
export const downvotePost = catchAsync(async (req, res) => {
  const userId = req.user?._id; // Use req.user._id to get the user's ObjectId
  if (!userId) {
    throw new AppError(401, "User is not authenticated");
  }
  const { postId } = req.params;

  const post = await postServices.downvotePostInDB(postId, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post downvoted successfully",
    data: post,
  });
});
// ---------search start here

export const searchAndFilterPosts = catchAsync(async (req, res) => {
  const searchTerm: any = req.query.search || "";
  const filters = {
    category: req.query.category,
    isPremium: req.query.isPremium === "true" ? true : undefined,
    startDate: req.query.startDate,
    endDate: req.query.endDate,
  };

  const posts = await postServices.searchAndFilterPosts(searchTerm, filters);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: posts,
  });
});

export const postController = {
  deletePost,
  updatePost,
  createPost,
  upvotePost,
  // downvotePost,
};
