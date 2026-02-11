import pino, { type Logger } from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const _PinoLevelToSeverityLookup = {
  debug: "DEBUG",
  error: "ERROR",
  fatal: "CRITICAL",
  info: "INFO",
  trace: "TRACE",
  warn: "WARNING",
};

let internalLogger = pino({
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  level: process.env.LOG_LEVEL || isDevelopment ? "debug" : "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

// If (isDevelopment) {
//   InternalLogger = pino({
//     Transport: {
//       Target: "pino-pretty",
//       Options: {
//         Colorize: true,
//       },
//     },
//   });
// }

if (isTest || isDevelopment) {
  // @ts-expect-error TODO: find a better way to disable pino
  internalLogger = {
    debug: console.debug,
    error: console.error,
    fatal: console.error,
    info: console.info,
    level: "debug",
    silent: console.log,
    trace: console.trace,
    warn: console.log,
  };
}

export const logger: Logger = internalLogger;
