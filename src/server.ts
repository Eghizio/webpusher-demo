import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./api.js";
import { httpLogger } from "./middlewares/httpLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createServer = (cookieSecret: string) => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, false);

        const allowList = [
          "http://localhost:3000",
          "http://localhost:5173",
          "https://frog02-30476.wykr.es",
        ];

        return callback(null, allowList.includes(origin));
      },
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
  app.use(cookieParser(cookieSecret));
  app.use(httpLogger);

  /*
    // Figure out Initial registration. Based on the "u" cookie.
    
    We can serve other HTML page and redirect based on the cookie.
    - Cookie not present - Onboarding HTML.
    - Cookie present - Application HTML.

    If no cookie - redirect to /onboarding
    If cookie present - display /
    If cookie present & accessing /onboarding - redirect to /

    Do we handle tampered cookies? Id Validation? Should we sign them?
    */

  app.use("/", (req, res, next) => {
    const userId = req.signedCookies["u"];

    const isOnboarding =
      req.path === "/onboarding" || req.path === "/onboarding/";
    const isApplication = req.path === "/";

    if (isOnboarding || isApplication) {
      console.log(req.url, req.path, { userId, isApplication, isOnboarding });
    }

    if (isApplication && !userId) {
      res.redirect("/onboarding/");
      return;
    }

    if (isOnboarding && userId) {
      res.redirect("/");
      return;
    }

    return next();
  });

  app.use(express.static(join(__dirname, "public")));

  app.use("/api/v1", apiRouter);

  app.use(errorHandler);

  return app;
};
