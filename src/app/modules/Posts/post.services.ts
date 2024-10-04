import { TImageFiles } from "../../interfaces/image.interface";
import { IPost } from "./post.interface";
import { Post } from "./post.model";
import { User } from "../User/user.model";
import AppError from "../../utils/errors/AppError";
import { TUser } from "../User/user.interface";
import { JwtPayload } from "jsonwebtoken";
import { title } from "process";

// Create Post Service Function
const createPostIntoDB = async (payload: IPost, images: TImageFiles) => {
  const { postImages } = images; // Corrected here
  payload.images = postImages.map((image) => image.path);

  const userId = payload.author;

  // Create new post in the DB
  const newPost = await Post.create(payload);

  // Push the post ID to the user's post array
  await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

  return newPost;
};

// Update Post Service Function
const updatePostInDB = async (
  postId: string,
  payload: Partial<IPost>,
  images?: TImageFiles
) => {
  if (images) {
    const { postImages } = images; // Ensure this is the correct naming

    payload.images = postImages?.map((image) => image.path);
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, payload, {
    new: true,
  });
  if (!updatedPost) {
    throw new AppError(404, "Post not found");
  }

  return updatedPost;
};

// Delete Post Service Function
const deletePostFromDB = async (postId: string, userId: string) => {
  const post = await Post.findOneAndDelete({ _id: postId, author: userId });
  if (!post) {
    throw new AppError(404, "Post not found or not authorized");
  }

  // Remove post reference from the user
  await User.findByIdAndUpdate(userId, { $pull: { posts: postId } });

  return post;
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

export const postServices = {
  createPostIntoDB,
  updatePostInDB,
  deletePostFromDB,
  upvotePostInDB,
  downvotePostInDB,
  searchAndFilterPosts,
};
