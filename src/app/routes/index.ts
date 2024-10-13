import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/User/user.route";
import { PostRoutes } from "../modules/Posts/post.routes";
import { commentRoutes } from "../modules/Comment/comment.routes";
import { paymentRoute } from "../modules/payment/paymentRoutes";
import { pdfRoute } from "../modules/pdfGenaration/pdfRoutes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/posts", // Corrected from "/users" to "/posts"
    route: PostRoutes,
  },
  {
    path: "/comments",
    route: commentRoutes,
  },
  {
    path: "/payments",
    route: paymentRoute,
  },
  {
    path: "/generate-pdf",
    route: pdfRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
