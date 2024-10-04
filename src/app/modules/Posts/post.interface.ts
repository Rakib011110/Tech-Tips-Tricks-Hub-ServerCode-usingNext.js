import mongoose, { ObjectId } from "mongoose";

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
}
export interface IComment {
  content: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  author?: mongoose.Types.ObjectId;
  images?: string[];
  category?: string;
  isPremium: boolean;
  upvotes?: number;
  downvotes?: number;
  isPremiumContent: boolean;
  upvotedBy?: mongoose.Types.ObjectId[];
  downvotedBy?: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[]; // Array of comment references
  createdAt: Date;
}
