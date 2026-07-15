import { type LogLevel, configureSync, getConsoleSink, getTextFormatter } from "@logtape/logtape";
import { getPrettyFormatter, type PrettyFormatterOptions } from "@logtape/pretty";

// const messageStyle: PrettyFormatterOptions["messageStyle"] = {};
// const categoryTruncate: PrettyFormatterOptions["categoryTruncate"] = {};

const prettyFormatterOptions: PrettyFormatterOptions = {
  // messageStyle,
  // categoryTruncate,
  properties: true,
  categoryWidth: 1,
};

const isBrowser = typeof window !== "undefined";

function getConfiguredLogLevel(): LogLevel {
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
    return "fatal";
  }

  return validLogLevels[value] ?? "fatal";
}

const globalConfigState = globalThis as { __tcgLogtapeConfigured?: boolean };

export function configureLogtape(logLevel?: LogLevel): void {
  if (globalConfigState.__tcgLogtapeConfigured) {
    return;
  }

  const resolvedLogLevel = logLevel || getConfiguredLogLevel();

  try {
    configureSync({
      reset: true,
      sinks: {
        meta: getConsoleSink(),
        console: getConsoleSink({
          formatter: isBrowser ? getTextFormatter() : getPrettyFormatter(prettyFormatterOptions),
        }),
      },
      loggers: [
        { category: ["core-engine"], sinks: ["console"], lowestLevel: resolvedLogLevel },
        { category: ["lorcana-engine"], sinks: ["console"], lowestLevel: resolvedLogLevel },
        { category: ["logtape", "meta"], sinks: ["meta"], lowestLevel: "warning" },
      ],
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("Already configured")) {
      throw error;
    }
  }

  globalConfigState.__tcgLogtapeConfigured = true;
}
