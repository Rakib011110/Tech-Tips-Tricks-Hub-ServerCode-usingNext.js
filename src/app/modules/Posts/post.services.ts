import { IComment, IPost } from "./post.interface";
import { Post } from "./post.model";
import { User } from "../User/user.model";
import AppError from "../../utils/errors/AppError";
import { TUser } from "../User/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { title } from "process";
import { Comment } from "../Comment/comment.model";
import mongoose from "mongoose";

const createPostIntoDB = async (payload: IPost) => {
  const userId = payload.author;

  const newPost = await Post.create(payload);

  await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

  return newPost; // Return the newly created post
};

export default { createPostIntoDB };

const getAllPostsFromDB = async () => {
  return await Post.find().populate("author"); // You can customize which fields to populate
};

// Get Posts by User ID Service Function
const getPostsByUserId = async (userId: string) => {
  return await Post.find({ author: userId }).populate("author", "name email");
};

// Fetch a single post by ID
export const getPostById = async (postId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post;
};

// Update Post Service Function
export const updatePostInDB = async (
  postId: string,
  payload: Partial<IPost>
) => {
  // Use findByIdAndUpdate with full payload
  const updatedPost = await Post.findByIdAndUpdate(postId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedPost) {
    throw new AppError(404, "Post not found");
  }

  return updatedPost;
};

const upvotePostInDB = async (postId: string, userId: JwtPayload["_id"]) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError(404, "Post not found");

  // Initialize empty arrays if they are undefined
  post.downvotedBy = post.downvotedBy ?? [];
  post.upvotedBy = post.upvotedBy ?? [];
  post.upvotes = post.upvotes ?? 0;
  post.downvotes = post.downvotes ?? 0;

  // Remove user from downvotes if they previously downvoted
  if (post.downvotedBy.includes(userId)) {
    post.downvotedBy = post.downvotedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
    post.downvotes--;
  }

  // Toggle upvote
  if (post.upvotedBy.includes(userId)) {
    post.upvotedBy = post.upvotedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
    post.upvotes--;
  } else {
    post.upvotedBy.push(userId);
    post.upvotes++;
  }

  await post.save();
  return post;
};

const downvotePostInDB = async (postId: string, userId: JwtPayload["_id"]) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError(404, "Post not found");

  // Initialize empty arrays if they are undefined
  post.downvotedBy = post.downvotedBy ?? [];
  post.upvotedBy = post.upvotedBy ?? [];
  post.upvotes = post.upvotes ?? 0;
  post.downvotes = post.downvotes ?? 0;

  // Remove user from upvotes if they previously upvoted
  if (post.upvotedBy.includes(userId)) {
    post.upvotedBy = post.upvotedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
    post.upvotes--;
  }

  // Toggle downvote
  if (post.downvotedBy.includes(userId)) {
    post.downvotedBy = post.downvotedBy.filter(
      (id) => id.toString() !== userId.toString()
    );
    post.downvotes--;
  } else {
    post.downvotedBy.push(userId);
    post.downvotes++;
  }

  await post.save();
  return post;
};

export const addCommentToPost = async (
  postId: string,
  commentData: Partial<IComment>
) => {
  // Properly convert postId to ObjectId
  commentData.post = new mongoose.Types.ObjectId(postId);

  // Create a new comment
  const comment = await Comment.create(commentData);

  // Add the comment to the post's comments array
  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment } }, // Push the entire comment, not just the ID
    { new: true }
  ).populate("comments");

  if (!post) {
    throw new AppError(404, "Post not found");
  }

  return comment;
};

//  search methods start here

export const searchAndFilterPosts = async (searchTerm: string, filter: any) => {
  const query: any = {};

  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { content: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Apply filters
  if (filter.category) {
    query.category = filter.category;
  }
  if (filter.isPremium !== undefined) {
    query.isPremium = filter.isPremium;
  }
  if (filter.startDate && filter.endDate) {
    query.createdAt = {
      $gte: new Date(filter.startDate),
      $lte: new Date(filter.endDate),
    };
  }
  return await Post.find(query).populate("author", "name email"); // Populate author data if needed
};

const deletePostFromDB = async (postId: string) => {
  // Delete the post by postId
  const post = await Post.findOneAndDelete({ _id: postId });
  console.log("posts", post);

  // If the post is not found, throw an error
  if (!post) {
    throw new AppError(404, "Post not found");
  }

  // Optionally, you can remove the post reference from the user if needed
  await User.updateMany({}, { $pull: { posts: postId } });

  return post; // Optionally return the deleted post
};
export const postServices = {
  createPostIntoDB,
  updatePostInDB,
  deletePostFromDB,
  upvotePostInDB,
  downvotePostInDB,
  searchAndFilterPosts,
  getPostsByUserId,
  getAllPostsFromDB,
  getPostById,
};
