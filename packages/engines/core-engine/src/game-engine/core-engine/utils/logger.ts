export enum LogLevel {
  VERBOSE = "VERBOSE",
  DEVELOPER = "DEVELOPER",
  ADVANCED_PLAYER = "ADVANCED_PLAYER",
  NORMAL_PLAYER = "NORMAL_PLAYER",
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

import pino, { type Logger } from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";
const isLoggerEnabled = process.env.AGENT !== "1";

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const _PinoLevelToSeverityLookup = {
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

if (isDevelopment) {
  internalLogger = pino({
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  });
}

if (isTest) {
  internalLogger = {
    // @ts-expect-error TODO: find a better way to disable pino
    group: console.group,
    groupEnd: console.groupEnd,
    trace: console.trace,
    warn: console.log,
    info: console.info,
    debug: console.debug,
    error: console.error,
    silent: console.log,
    fatal: console.error,
    log: console.log,
    level: "debug",
  };
}

if (!isLoggerEnabled) {
  internalLogger = {
    trace: () => {},
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {},
    fatal: () => {},
    silent: () => {},
    // @ts-expect-error TODO: find a better way to disable pino
    log: () => {},
    level: "silent",
  };
}

export const debuggers = isLoggerEnabled
  ? ({
      transportMessages: true,
      dispatchActions: true,
      testEngine: true,
      stateTransitions: true,
      flowTransitions: true,
      moves: true,
      zoneOperations: true,
    } as const)
  : ({
      transportMessages: false,
      dispatchActions: false,
      testEngine: false,
      stateTransitions: false,
      flowTransitions: false,
      moves: false,
      zoneOperations: false,
    } as const);

export const logger: Logger & {
  group?: (...data: any[]) => void;
  groupEnd?: (...data: any[]) => void;
  log?: (...data: any[]) => void;
} = internalLogger;

export type EngineLogger = typeof logger;

export class LogCollector {
  private entries: LogEntry[] = [];

  log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    this.entries.push({
      level,
      message,
      timestamp: Date.now(),
      data,
    });
  }

  getEntries(): LogEntry[] {
    return this.entries;
  }

  merge(other: LogCollector): void {
    this.entries.push(...other.getEntries());
  }
}
