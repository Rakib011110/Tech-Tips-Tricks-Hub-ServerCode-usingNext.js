import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import router from "./app/routes";

const app: Application = express();

// app.use(cors());
app.use(
  cors({
    origin: [
      "https://tech-tips-hub-client-code-using-next-js.vercel.app",
      "http://localhost:3000",
    ], // Only allow this origin
    credentials: true, // Allow credentials (cookies, authentication)
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers your frontend uses
  })
);

// app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

//! this is only for developement
// meiliClient.index('items').deleteAllDocuments();

//Testing
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to the techHub",
  });
});

export default app;
