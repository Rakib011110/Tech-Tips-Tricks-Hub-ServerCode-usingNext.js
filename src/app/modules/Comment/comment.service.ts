import { IComment } from "./comment.interface";
import { Comment } from "./comment.model";
import AppError from "../../utils/errors/AppError";
import { Post } from "../Posts/post.model";

const createCommentInDB = async (payload: IComment) => {
  // Create the comment in the database
  const comment = await Comment.create(payload);

  // Update the post to add the new comment to its comments array
  const updatedPost = await Post.findByIdAndUpdate(
    payload.post,
    { $push: { comments: comment._id } },
    { new: true }
  );

  if (!updatedPost) {
    throw new AppError(404, "Post not found");
  }

  return comment;
};

const getCommentsForPostInDB = async (postId: string) => {
  const comments = await Comment.find({ post: postId })
    .populate("author")
    .populate("content");
  return comments;
};

export const commentServices = {
  createCommentInDB,
  getCommentsForPostInDB,
};
