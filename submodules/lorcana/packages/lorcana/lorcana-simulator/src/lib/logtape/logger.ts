import {
  type LogLevel,
  configureSync,
  getConsoleSink,
  getLogger,
  getTextFormatter,
} from "@logtape/logtape";
import { prettyFormatter } from "@logtape/pretty";

let isConfigured = false;

function getConfiguredLogLevel(): LogLevel | null {
  const validLogLevels: Record<string, LogLevel> = {
    trace: "trace",
    debug: "debug",
    info: "info",
    warn: "warning",
    warning: "warning",
    error: "error",
    fatal: "fatal",
  };

  const processEnv = globalThis as { process?: { env?: Record<string, string | undefined> } };
  const value = processEnv.process?.env?.LOG_LEVEL?.toLowerCase();

  if (!value) {
    return null;
  }

  return validLogLevels[value] ?? null;
}

function getSimulatorLogLevel(): LogLevel {
  const configuredLogLevel = getConfiguredLogLevel();

  if (configuredLogLevel) {
    return configuredLogLevel;
  }

  return import.meta.env.DEV ? "trace" : "info";
}

export function configureCoreSimulatorLogging(): void {
  if (isConfigured) {
    return;
  }

  const level = getSimulatorLogLevel();

  configureSync({
    sinks: {
      console: getConsoleSink({
        formatter: !import.meta.env.PROD ? prettyFormatter : getTextFormatter(),
      }),
    },
    loggers: [
      {
        category: ["tcg"],
        lowestLevel: level,
        sinks: ["console"],
      },
      {
        category: ["lorcana-engine"],
        lowestLevel: level,
        sinks: ["console"],
      },
      {
        category: ["core-engine"],
        lowestLevel: level,
        sinks: ["console"],
      },
      {
        category: ["logtape"],
        lowestLevel: "error",
        sinks: ["console"],
      },
    ],
    reset: true,
  });

  isConfigured = true;
}

export const logger = getLogger(["tcg", "core-simulator"]);
