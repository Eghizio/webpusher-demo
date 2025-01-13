import type { IncomingMessage, ServerResponse } from "node:http";
import morgan from "morgan";
import colors from "colors";
import { config, Environment } from "../Config.js";

type MorganFormatFn = <Req extends IncomingMessage, Res extends ServerResponse>(
  request: Req,
  response: Res,
  callback: (error?: Error) => void
) => void;

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
  production: morgan(
    ":date[iso] :method :url :status :response-time ms - :res[content-length]"
  ),

  development: morgan((tokens, req, res) => {
    const date = tokens["date"](req, res) ?? new Date();
    const method = tokens["method"](req, res) ?? req.method;
    const url = tokens["url"](req, res) ?? req.url;
    const status =
      tokens["status"](req, res) ?? res.headersSent ? res.statusCode : -1;

    const log = [
      date ? new Date(date).toISOString() : null,
      method ? colors.magenta(method) : null,
      url ? colors.underline(url) : null,
      status ? colorStatus(status) : null,
    ]
      .filter(Boolean)
      .join(" ");

    return log;
  }),

  test: morgan(
    ":date[iso] :method :url :status :response-time ms - :res[content-length]"
  ),
} as const;

export const morganLogger = logFormat[config.environment];
