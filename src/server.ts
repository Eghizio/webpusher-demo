import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { apiRouter } from "./api.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createServer = (cookieSecret: string) => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser(cookieSecret));
  app.use(morgan("dev"));
  app.use(express.static(join(__dirname, "public")));

  app.use("/api/v1", apiRouter);

  app.use(errorHandler);

  return app;
};
