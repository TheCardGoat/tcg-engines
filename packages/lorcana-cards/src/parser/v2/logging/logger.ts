/**
 * Logging infrastructure for v2 parser.
 * Provides structured logging with context.
 */

import type { LogContext } from "./context";

export type LogLevel = "debug" | "info" | "warn" | "error";

class ParserLogger {
  private level: LogLevel = "info";
  private enabled = true;
  private initialized = false;

  /**
   * Lazily initializes logger configuration from environment variables.
   * Called automatically on first log operation.
   */
  private ensureInitialized(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    if (process.env.PARSER_DEBUG === "true") {
      this.level = "debug";
    }
  }

  setLevel(level: LogLevel): void {
    this.ensureInitialized();
    this.level = level;
  }

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    this.ensureInitialized();
    if (!this.enabled) {
      return;
    }
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };

    // Use console for now, can be replaced with pino/winston later
    const logFn = level === "error" ? console.error : (level === "warn" ? console.warn : console.log);
    logFn(JSON.stringify(logEntry));
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    const currentIndex = levels.indexOf(this.level);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  }
}

export const logger = new ParserLogger();
