import { TImageFiles } from "../../interfaces/image.interface";
import { getPostById, postServices } from "./post.services";
import AppError from "../../utils/errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// Create a new Post
export const createPost = catchAsync(async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  // Ensure that the 'postImages' are uploaded
  if (!req.files || !req.files.postImages) {
    throw new AppError(400, "Please upload an image");
  }

  // Parse 'data' (assuming it's passed as JSON string from frontend or Postman)
  const parsedData = JSON.parse(req.body.data);

  // Pass parsedData (contains post info) and req.files (images) to the service
  const post = await postServices.createPostIntoDB(parsedData, req.files);

  // Send successful response
  sendResponse(res, {
    success: true,
    statusCode: 201, // Created
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

// Get All Posts
export const getAllPosts = catchAsync(async (req, res) => {
  const posts = await postServices.getAllPostsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All posts retrieved successfully",
    data: posts,
  });
});

// Get Posts by User ID
export const getPostsByUser = catchAsync(async (req, res) => {
  const userId = req.params.userId; // Assuming userId is passed as a URL parameter
  const posts = await postServices.getPostsByUserId(userId);

  if (posts.length === 0) {
    throw new AppError(404, "No posts found for this user");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts by user retrieved successfully",
    data: posts,
  });
});

const fetchPostById = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const post = await postServices.getPostById(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
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
  downvotePost,
  getAllPosts,
  getPostsByUser,
  fetchPostById,
};
