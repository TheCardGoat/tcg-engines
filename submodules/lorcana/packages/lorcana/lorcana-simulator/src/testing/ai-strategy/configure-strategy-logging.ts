import { configureSync, getConsoleSink, type LogRecord } from "@logtape/logtape";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

type StrategyRuntimeLogRecord = {
  category: readonly string[];
  level: LogRecord["level"];
  message: string;
  properties: LogRecord["properties"];
  rawMessage: readonly string[] | string;
  timestamp: number;
};

function serializeRuntimeLogRecord(record: LogRecord): StrategyRuntimeLogRecord {
  return {
    category: record.category,
    level: record.level,
    message: record.message.map((part) => String(part)).join(""),
    properties: record.properties,
    rawMessage:
      typeof record.rawMessage === "string" ? record.rawMessage : Array.from(record.rawMessage),
    timestamp: record.timestamp,
  };
}

export function configureStrategySuiteLogging(runtimeLogPath: string): void {
  mkdirSync(dirname(runtimeLogPath), { recursive: true });
  writeFileSync(runtimeLogPath, "");

  const processGlobal = globalThis as { process?: { env?: Record<string, string | undefined> } };
  processGlobal.process ??= {};
  processGlobal.process.env ??= {};
  processGlobal.process.env.LORCANA_RUNTIME_TRACE = "1";

  configureSync({
    sinks: {
      console: getConsoleSink(),
      runtimeFile: (record) => {
        appendFileSync(
          runtimeLogPath,
          `${JSON.stringify(serializeRuntimeLogRecord(record))}\n`,
          "utf8",
        );
      },
    },
    loggers: [
      {
        category: ["core-engine"],
        lowestLevel: "trace",
        sinks: ["runtimeFile"],
      },
      {
        category: ["lorcana-engine"],
        lowestLevel: "trace",
        sinks: ["runtimeFile"],
      },
      {
        category: ["logtape", "meta"],
        lowestLevel: "warning",
        sinks: ["runtimeFile"],
      },
      {
        category: ["lorcana-simulator", "strategy"],
        lowestLevel: "info",
        sinks: ["console"],
      },
    ],
    reset: true,
  });
}
