import type { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../models.js";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack, getRequestInformation(req));

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApplicationError) {
    res
      .status(error.statusCode)
      .set(error.headers)
      .json({ error: error.message });
    return;
  }

  res.status(500).json({ error: "Internal Server Error" });
};

const getRequestInformation = (req: Request) => {
  return {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    params: req.params,
    query: req.query,
    body: req.body,
  };
};
