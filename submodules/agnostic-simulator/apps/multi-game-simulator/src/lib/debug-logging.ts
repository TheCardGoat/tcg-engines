import { isGatewayPacketLoggingEnabled } from "@tcg/gateway-client";

const SENSITIVE_KEY_PATTERN = /ticket|token|secret|password|authorization|cookie/i;
const MAX_REDACT_DEPTH = 6;

/**
 * Shallow-copy redaction of credential-bearing fields so debug console output
 * (staging packet log, SSR bootstrap dump) never prints live secrets.
 */
export function redactSensitive(value: unknown, depth = 0): unknown {
  if (depth >= MAX_REDACT_DEPTH || value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactSensitive(item, depth + 1));
  }
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    out[key] = SENSITIVE_KEY_PATTERN.test(key)
      ? "[redacted]"
      : redactSensitive(item, depth + 1);
  }
  return out;
}

/** Console-logs `payload` under `label` whenever gateway packet logging is on. */
export function logDebugPayload(label: string, payload: unknown): void {
  if (!isGatewayPacketLoggingEnabled()) return;
  // eslint-disable-next-line no-console
  console.log(label, redactSensitive(payload));
}
