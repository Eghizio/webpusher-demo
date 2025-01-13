import type { IncomingMessage, ServerResponse } from "node:http";
import morgan, { type Options } from "morgan";
import * as FileStreamRotator from "file-stream-rotator";
import colors from "colors";
import { config, type Environment } from "../Config.js";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const __dirname = dirname(fileURLToPath(import.meta.url));

// Todo: Move to Winston?
type MorganFormatFn<Req extends IncomingMessage, Res extends ServerResponse> = (
  request: Req,
  response: Res,
  callback: (error?: Error) => void
) => void;

type LoggerConfigurator = <
  Req extends IncomingMessage,
  Res extends ServerResponse
>(
  options?: Options<Req, Res>
) => MorganFormatFn<Req, Res>;

type LoggerResolver = Record<Environment, LoggerConfigurator>;

// Todo: Setup Dual logs -> Console -> Rotating File (1d interval + compression 7d).
const colorStatus = (status: number) => {
  const statusCode = status.toString();
  if (status >= 500) return colors.red(statusCode);
  if (status >= 400) return colors.yellow(statusCode);
  if (status >= 300) return colors.cyan(statusCode);
  if (status >= 200) return colors.green(statusCode);
  return statusCode;
};

const loggers: LoggerResolver = {
  production: (options) =>
    morgan(
      ":date[iso] :method :url :status :response-time ms - :res[content-length]",
      options
    ),

  development: (options) =>
    morgan((tokens, req, res) => {
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
    }, options),

  test: (options) =>
    morgan(
      ":date[iso] :method :url :status :response-time ms - :res[content-length]",
      options
    ),
} as const;

const logsDir = join(__dirname, "..", "..", "logs");
const logStream = FileStreamRotator.getStream({
  filename: join(logsDir, "%DATE%"),
  extension: ".log",

  frequency: "daily",
  date_format: "Y_M_D",
  utc: true,

  audit_file: join(logsDir, "_audit.json"),
  // create_symlink: true,
  // symlink_name: "tail-current.log",
});

export const httpLogger = [
  /* Console */
  loggers[config.environment](),
  /* File - no colors */
  loggers["production"]({ stream: logStream }), // Use in dev/test env?
];
