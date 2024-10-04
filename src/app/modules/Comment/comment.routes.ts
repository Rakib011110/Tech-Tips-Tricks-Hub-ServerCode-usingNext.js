// comment.routes.ts
import express from "express";
import { createComment, getCommentsForPost } from "./comment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post("/create-comment", auth(USER_ROLE.USER), createComment);
router.get("/:postId", getCommentsForPost);

export const commentRoutes = router;
