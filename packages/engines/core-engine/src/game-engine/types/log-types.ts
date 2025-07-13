export enum LogLevel {
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
