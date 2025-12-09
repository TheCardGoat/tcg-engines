export declare enum LogLevel {
    VERBOSE = "VERBOSE",
    DEVELOPER = "DEVELOPER",
    ADVANCED_PLAYER = "ADVANCED_PLAYER",
    NORMAL_PLAYER = "NORMAL_PLAYER"
}
export interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: number;
    data?: Record<string, unknown>;
}
import { type Logger } from "pino";
export declare const debuggers: {
    readonly transportMessages: true;
    readonly dispatchActions: true;
    readonly testEngine: true;
    readonly stateTransitions: true;
    readonly flowTransitions: true;
    readonly moves: true;
    readonly zoneOperations: true;
};
export declare const logger: Logger & {
    group?: (...data: any[]) => void;
    groupEnd?: (...data: any[]) => void;
};
export declare class LogCollector {
    private entries;
    log(level: LogLevel, message: string, data?: Record<string, unknown>): void;
    getEntries(): LogEntry[];
    merge(other: LogCollector): void;
}
//# sourceMappingURL=logger.d.ts.map