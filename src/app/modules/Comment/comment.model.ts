import mongoose, { Schema } from "mongoose";
import { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // Ensure this is always required
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
