import type { IncomingMessage, ServerResponse } from "node:http";
import morgan, { type TokenIndexer } from "morgan";
// import type { Request, Response } from "express";
import colors from "colors";
import { config, Environment } from "../Config.js";

type MorganFormatFn = <Req extends IncomingMessage, Res extends ServerResponse>(
  tokens: TokenIndexer<Req, Res>,
  req: Req,
  res: Res
) => string | undefined | null;

// Todo: Setup Dual logs -> Console -> Rotating File (1d interval + compression 7d).
const colorStatus = (status: number) => {
  const statusCode = status.toString();
  if (status >= 500) return colors.red(statusCode);
  if (status >= 400) return colors.yellow(statusCode);
  if (status >= 300) return colors.cyan(statusCode);
  if (status >= 200) return colors.green(statusCode);
  return statusCode;
};

const logFormat: Record<Environment, MorganFormatFn> = {
  production: () =>
    ":date[iso] :method :url :status :response-time ms - :res[content-length]",

  development: (tokens, req, res) => {
    const date = tokens["date"](req, res) ?? new Date();
    const method = tokens["method"](req, res) ?? req.method;
    const url = tokens["url"](req, res) ?? req.url;
    const status =
      tokens["status"](req, res) ?? res.headersSent ? res.statusCode : -1;

    const log = [
      date ? new Date(date).toISOString() : null,
      method ? colors.magenta(method) : null,
      url ? colors.cyan(url) : null,
      status ? colorStatus(status) : null,
    ]
      .filter(Boolean)
      .join(" ");

    return log;
  },

  test: () =>
    ":date[iso] :method :url :status :response-time ms - :res[content-length]",
} as const;

export const morganLogger = morgan(logFormat[config.environment]);
