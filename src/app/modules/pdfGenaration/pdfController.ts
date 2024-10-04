import PDFDocument from "pdfkit";
// controllers/pdfController.ts
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { Post } from "../Posts/post.model";

export const generatePdf = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;

  // Fetch the post content
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${post.title}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text(post.title, { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(post.content, { align: "left" });

  doc.end();
});
