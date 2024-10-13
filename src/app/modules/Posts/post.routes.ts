import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
// import validateRequest from "../../middlewares/validateRequest";
// import multer from "multer";
import {
  addComment,
  createPost,
  deletePost,
  downvotePost,
  getAllPosts,
  getPostsByUser,
  postController,
  searchAndFilterPosts,
  updatePost,
  upvotePost,
} from "./post.controller";
// import { multerUpload } from "../../config/multer.config";

// File Upload Middleware
// const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/create-post",
  //   auth(USER_ROLE.USER),
  // multerUpload.fields([{ name: "postImages" }]),
  //   validateRequest(PostValidation.createPostValidationSchema),
  createPost
);
router.post(
  "/create-post",

  createPost
);

router.patch(
  "/update-post/:id",
  // auth(USER_ROLE.USER),

  //   validateRequest(PostValidation.updatePostValidationSchema),
  updatePost
);

// Get All Posts
router.get("/:id", postController.fetchPostById);
router.get("/", getAllPosts);

// Get Posts by User ID
router.get("/user/:userId", getPostsByUser); // Assuming the userId will be passed as a route parameter

// auth(USER_ROLE.USER)
router.delete("/:id", deletePost);
router.patch("/upvote/:postId", auth(USER_ROLE.USER), upvotePost);
router.patch("/downvote/:postId", auth(USER_ROLE.USER), downvotePost);
router.get("/search", searchAndFilterPosts);
router.post("/comments/:id", auth(USER_ROLE.USER), addComment);

export const PostRoutes = router;
