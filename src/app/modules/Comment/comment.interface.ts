import mongoose from "mongoose";

export interface IComment {
  _id?: string;
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId; // Make this required since it should always relate to a post
  createdAt?: Date;
}
