// routes/pdfRoutes.ts
import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import { generatePdf } from "./pdfController";

const router = express.Router();

// Route to generate PDF
router.post("/:postId", auth(USER_ROLE.USER), generatePdf);

export const pdfRoute = router;
