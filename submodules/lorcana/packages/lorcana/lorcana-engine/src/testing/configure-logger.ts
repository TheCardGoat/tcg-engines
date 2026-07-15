import { type LogLevel, configureSync, getConsoleSink } from "@logtape/logtape";
import { getPrettyFormatter, type PrettyFormatterOptions } from "@logtape/pretty";

const prettyFormatterOptions: PrettyFormatterOptions = {
  // messageStyle,
  // categoryTruncate,
  properties: true,
  categoryWidth: 1,
};

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

const resolvedLogLevel = getConfiguredLogLevel();

const globalConfigState = globalThis as { __tcgLogtapeConfigured?: boolean };
const processEnv = globalThis as { process?: { env?: Record<string, string | undefined> } };

if (!processEnv.process?.env?.LORCANA_RUNTIME_TRACE) {
  processEnv.process ??= {};
  processEnv.process.env ??= {};
  processEnv.process.env.LORCANA_RUNTIME_TRACE = "1";
}

if (!globalConfigState.__tcgLogtapeConfigured) {
  try {
    configureSync({
      sinks: {
        meta: getConsoleSink(),
        console: getConsoleSink({
          formatter: getPrettyFormatter(prettyFormatterOptions),
        }),
      },
      loggers: [
        { category: ["core-engine"], sinks: ["console"], lowestLevel: resolvedLogLevel },
        { category: ["lorcana-engine"], sinks: ["console"], lowestLevel: resolvedLogLevel },
        { category: ["logtape", "meta"], sinks: ["meta"], lowestLevel: "warning" },
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("Already configured")) {
      throw error;
    }
  }

  globalConfigState.__tcgLogtapeConfigured = true;
}
