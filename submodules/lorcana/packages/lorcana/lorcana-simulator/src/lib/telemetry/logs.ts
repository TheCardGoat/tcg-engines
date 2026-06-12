import { logs, SeverityNumber } from "@opentelemetry/api-logs";
import {
  normalizePathForTelemetry,
  sanitizeTelemetryAttributes,
  type TelemetryAttributes,
} from "./config.js";

const LOGGER_NAME = "lorcana-simulator-browser";

let globalHandlersInstalled = false;

function currentRoute(): string {
  if (typeof window === "undefined") return "server";
  return normalizePathForTelemetry(window.location?.pathname ?? "browser");
}

function errorAttributes(error?: Error): TelemetryAttributes {
  if (!error) return {};
  return {
    "error.name": error.name,
    "error.message": error.message.slice(0, 180),
  };
}

function emit(
  severityNumber: SeverityNumber,
  severityText: string,
  message: string,
  attributes: TelemetryAttributes = {},
): void {
  logs.getLogger(LOGGER_NAME).emit({
    severityNumber,
    severityText,
    body: message.slice(0, 180),
    attributes: sanitizeTelemetryAttributes({
      route: currentRoute(),
      ...attributes,
    }),
  });
}

export function logInfo(message: string, attributes?: TelemetryAttributes): void {
  emit(SeverityNumber.INFO, "INFO", message, attributes);
}

export function logWarn(message: string, attributes?: TelemetryAttributes): void {
  emit(SeverityNumber.WARN, "WARN", message, attributes);
}

export function logError(
  message: string,
  attributes: TelemetryAttributes = {},
  error?: Error,
): void {
  emit(SeverityNumber.ERROR, "ERROR", message, {
    ...attributes,
    ...errorAttributes(error),
  });
}

export function logOperationalEvent(
  eventName: string,
  attributes: TelemetryAttributes = {},
  severity: "info" | "warn" | "error" = "info",
): void {
  const baseAttributes = { "event.name": eventName, ...attributes };
  if (severity === "error") {
    logError(eventName, baseAttributes);
    return;
  }
  if (severity === "warn") {
    logWarn(eventName, baseAttributes);
    return;
  }
  logInfo(eventName, baseAttributes);
}

export function installGlobalBrowserLogHandlers(): void {
  if (globalHandlersInstalled || typeof window === "undefined") return;
  globalHandlersInstalled = true;

  window.addEventListener("error", (event) => {
    logError(
      "window_error",
      {
        source: "window.error",
        filename: normalizePathForTelemetry(event.filename),
        lineno: event.lineno,
        colno: event.colno,
      },
      event.error instanceof Error ? event.error : undefined,
    );
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    logError(
      "unhandled_rejection",
      { source: "window.unhandledrejection" },
      reason instanceof Error ? reason : undefined,
    );
  });
}
