/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
// import { seed } from "./app/utils/seeding";
import app from "./app";
import config from "./app/config";

let server: Server;

process.on("uncaughtException", (error) => {
  console.error("Something went wrong! Uncaught exception detected:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error(
    "Unexpected error occurred: Unhandled rejection detected!",
    error
  );
  if (server) {
    server.close(() => {
      console.error("Server shutting down due to unhandled rejection.");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

async function bootstrap() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully.");
    // await seed();
    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running smoothly on port ${config.port}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

bootstrap();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received, shutting down gracefully.");
  if (server) {
    server.close(() => {
      console.log("Server closed successfully due to SIGTERM.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received, initiating shutdown.");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully due to SIGINT.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
