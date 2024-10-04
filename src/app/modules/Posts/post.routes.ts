import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { PostValidation } from "./post.validation";
import multer from "multer";
import {
  createPost,
  deletePost,
  downvotePost,
  searchAndFilterPosts,
  updatePost,
  upvotePost,
} from "./post.controller";
import { multerUpload } from "../../config/multer.config";

// File Upload Middleware
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/create-post",
  //   auth(USER_ROLE.USER),
  multerUpload.fields([{ name: "postImages" }]),
  //   validateRequest(PostValidation.createPostValidationSchema),
  createPost
);

router.patch(
  "/:id/update-post",
  // auth(USER_ROLE.USER),
  multerUpload.fields([{ name: "postImages" }]),
  //   validateRequest(PostValidation.updatePostValidationSchema),
  updatePost
);

// auth(USER_ROLE.USER)
router.delete("/:id", deletePost);
router.patch("/upvote/:postId", auth(USER_ROLE.USER), upvotePost);
router.patch("/downvote/:postId", auth(USER_ROLE.USER), downvotePost);
router.get("/search", searchAndFilterPosts);

export const PostRoutes = router;
