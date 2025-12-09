export var LogLevel;
(function (LogLevel) {
    LogLevel["VERBOSE"] = "VERBOSE";
    LogLevel["DEVELOPER"] = "DEVELOPER";
    LogLevel["ADVANCED_PLAYER"] = "ADVANCED_PLAYER";
    LogLevel["NORMAL_PLAYER"] = "NORMAL_PLAYER";
})(LogLevel || (LogLevel = {}));
import pino from "pino";
const isDevelopment = process.env.NODE_ENV !== "production";
const isTest = process.env.NODE_ENV === "test";
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
        level: "debug",
    };
}
export const debuggers = {
    transportMessages: true,
    dispatchActions: true,
    testEngine: true,
    stateTransitions: true,
    flowTransitions: true,
    moves: true,
    zoneOperations: true,
};
export const logger = internalLogger;
export class LogCollector {
    entries = [];
    log(level, message, data) {
        this.entries.push({
            level,
            message,
            timestamp: Date.now(),
            data,
        });
    }
    getEntries() {
        return this.entries;
    }
    merge(other) {
        this.entries.push(...other.getEntries());
    }
}
//# sourceMappingURL=logger.js.map