import type { LogEntry, LogLevel } from "../types/log-types";

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
