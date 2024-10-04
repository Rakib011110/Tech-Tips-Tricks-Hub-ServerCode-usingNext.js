import mongoose, { Schema } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  isPremiumContent: { type: Boolean, default: false }, // New field to indicate premium content

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.model<IPost>("Post", postSchema);
