import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  author?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
}

const commentSchema = new Schema<IComment>({
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
