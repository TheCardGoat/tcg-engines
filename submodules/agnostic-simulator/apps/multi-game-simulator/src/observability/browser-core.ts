const REDACTED = "[redacted]";
const DEFAULT_TRACE_SAMPLE_RATIO = 0.02;
const MAX_MESSAGE_LENGTH = 1_500;
const SENSITIVE_KEY =
  /(authorization|auth|token|ticket|secret|password|cookie|session|credential)/i;
const UUID_SEGMENT = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NUMERIC_SEGMENT = /^\d+$/;
const OPAQUE_SEGMENT = /^[a-z0-9_-]{16,}$/i;

export type BrowserResourceConfig = {
  serviceName: string;
  serviceVersion?: string;
  deploymentEnvironment: string;
};

function redactString(value: string): string {
  return value
    .replace(
      /([?&](?:[^=&#]*(?:authorization|auth|token|ticket|secret|password|cookie|session|credential)[^=&#]*)=)[^&#\s]+/gi,
      `$1${REDACTED}`,
    )
    .replace(/\b(Bearer)\s+[a-z0-9._~+/-]+=*/gi, `$1 ${REDACTED}`);
}

export function sanitizeTelemetryValue(value: unknown, depth = 0): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: redactString(value.message),
      stack: value.stack ? redactString(value.stack) : undefined,
    };
  }

  if (typeof value === "string") return redactString(value);
  if (value == null || typeof value !== "object") return value;
  if (depth > 2) return "[object]";
  if (Array.isArray(value)) {
    return value.slice(0, 10).map((item) => sanitizeTelemetryValue(item, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, 25)
      .map(([key, item]) => [
        key,
        SENSITIVE_KEY.test(key) ? REDACTED : sanitizeTelemetryValue(item, depth + 1),
      ]),
  );
}

export function stringifyTelemetryValue(value: unknown): string {
  if (typeof value === "string") return sanitizeTelemetryValue(value) as string;
  try {
    return JSON.stringify(sanitizeTelemetryValue(value));
  } catch {
    return "[unserializable]";
  }
}

export function messageFromConsoleArgs(args: unknown[]): string {
  return args.map(stringifyTelemetryValue).join(" ").slice(0, MAX_MESSAGE_LENGTH);
}

export function normalizeRoute(pathname: string): string {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      UUID_SEGMENT.test(segment) || NUMERIC_SEGMENT.test(segment) || OPAQUE_SEGMENT.test(segment)
        ? ":id"
        : segment,
    );
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

export function parseTraceSampleRatio(
  value: string,
  fallback = DEFAULT_TRACE_SAMPLE_RATIO,
): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : fallback;
}

export function buildResourceAttributes(config: BrowserResourceConfig): Record<string, string> {
  return {
    "service.name": config.serviceName,
    ...(config.serviceVersion ? { "service.version": config.serviceVersion } : {}),
    "deployment.environment.name": config.deploymentEnvironment,
  };
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildOtlpIgnoreUrls(endpoint: string): RegExp[] {
  const normalized = endpoint.replace(/\/+$/, "");
  return [new RegExp(`^${escapeRegExp(normalized)}/v1/(?:logs|traces)(?:[?#]|$)`, "i")];
}

export function buildPropagationTargets(values: string[], fallbackOrigin: string): RegExp[] {
  const targets = values.length > 0 ? values : [fallbackOrigin];
  return targets.flatMap((value) => {
    try {
      const origin = new URL(value).origin;
      return [new RegExp(`^${escapeRegExp(origin)}(?:/|$)`, "i")];
    } catch {
      return [];
    }
  });
}

export class TelemetryEventGate {
  private count = 0;
  private windowStartedAt = 0;
  private readonly recent = new Map<string, number>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly dedupeMs: number;

  constructor(limit: number, windowMs = 60_000, dedupeMs = 5_000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.dedupeMs = dedupeMs;
  }

  accept(fingerprint: string, now = Date.now()): boolean {
    if (this.windowStartedAt === 0 || now - this.windowStartedAt >= this.windowMs) {
      this.windowStartedAt = now;
      this.count = 0;
      this.recent.clear();
    }

    const lastSeenAt = this.recent.get(fingerprint);
    if (lastSeenAt !== undefined && now - lastSeenAt < this.dedupeMs) return false;
    if (this.count >= this.limit) return false;

    this.count += 1;
    this.recent.set(fingerprint, now);
    return true;
  }
}
