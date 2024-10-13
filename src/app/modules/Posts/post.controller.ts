import { addCommentToPost, getPostById, postServices } from "./post.services";
import AppError from "../../utils/errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { IComment } from "./post.interface";

// Create a new Post
export const createPost = catchAsync(async (req, res) => {
  console.log("Request Body:", req.body);

  const post = await postServices.createPostIntoDB(req.body);

  // Send successful response
  sendResponse(res, {
    success: true,
    statusCode: 201, // Created
    message: "Post created successfully",
    data: post,
  });
});

// export const createPost = catchAsync(async (req, res) => {
//   console.log("Request Body:", req.body);
//   console.log("Uploaded Files:", req.files);

//   // Ensure that the 'postImages' are uploaded
//   const files = req.files as TImageFiles; // Type assertion to TImageFiles

//   if (!files || !files.postImages) {
//     throw new AppError(400, "Please upload an image");
//   }

//   // Parse 'data' (assuming it's passed as JSON string from frontend or Postman)
//   const parsedData = JSON.parse(req.body.data);

//   // Wrap the postImages array into an object to match TImageFiles type
//   const postImages: TImageFiles = {
//     postImages: files.postImages,
//   };

//   // Pass parsedData (contains post info) and postImages (images) to the service
//   const post = await postServices.createPostIntoDB(parsedData, postImages);

//   // Send successful response
//   sendResponse(res, {
//     success: true,
//     statusCode: 201, // Created
//     message: "Post created successfully",
//     data: post,
//   });
// });
// Update a Post
export const updatePost = catchAsync(async (req, res) => {
  const postId = req.params.id;

  console.log("Update Payload:", req.body);

  const post = await postServices.updatePostInDB(postId, req.body);

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
  const postId = req.params.id;
  const post = await postServices.getPostById(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: post,
  });
});
// Delete a Post

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

// Comment on a Post
// export const addComment = catchAsync(async (req, res) => {
//   const postId = req.params.id; // Ensure consistency in your parameter naming (should be "id" or "_id" consistently)

//   // Ensure the postId is valid
//   if (!mongoose.Types.ObjectId.isValid(postId)) {
//     throw new AppError(400, "Invalid Post ID");
//   }

//   const commentData: IComment = {
//     content: req.body.content,
//     author: req.user._id, // Assuming the JWT middleware attaches the user ID
//     post: postId,
//     createdAt: new Date(), // Explicitly set `createdAt` for the type requirements
//   };

//   const comment = await addCommentToPost(postId, commentData);

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.CREATED,
//     message: "Comment added successfully",
//     data: comment,
//   });
// });

export const addComment = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const commentData: Partial<IComment> = {
    content: req.body.content,
    author: req.user._id, // Assuming the JWT middleware attaches the user ID
  };

  // Add comment to the post
  const comment = await addCommentToPost(postId, commentData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Comment added successfully",
    data: comment,
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

export const deletePost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  console.log(postId);

  const post = await postServices.deletePostFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: post,
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
