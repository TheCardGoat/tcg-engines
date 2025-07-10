import pino, { type Logger } from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToSeverityLookup = {
  trace: "TRACE",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL",
};

let internalLogger = pino({
  level: process.env.LOG_LEVEL || isDevelopment ? "debug" : "info",
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// if (isDevelopment) {
//   internalLogger = pino({
//     transport: {
//       target: "pino-pretty",
//       options: {
//         colorize: true,
//       },
//     },
//   });
// }

if (isTest || isDevelopment) {
  // @ts-expect-error TODO: find a better way to disable pino
  internalLogger = {
    trace: console.trace,
    warn: console.log,
    info: console.info,
    debug: console.debug,
    error: console.error,
    silent: console.log,
    fatal: console.error,
    level: "debug",
  };
}

export const logger: Logger = internalLogger;
