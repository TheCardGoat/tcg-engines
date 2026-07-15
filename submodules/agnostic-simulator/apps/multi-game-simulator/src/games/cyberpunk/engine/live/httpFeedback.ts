export type LiveFeedbackSeverity = "warning" | "error";

export class LiveHttpError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly severity: LiveFeedbackSeverity;

  constructor(input: {
    message: string;
    status: number;
    code?: string;
    severity?: LiveFeedbackSeverity;
  }) {
    super(input.message);
    this.name = "LiveHttpError";
    this.status = input.status;
    this.code = input.code;
    this.severity = input.severity ?? "error";
  }
}

export async function createLiveHttpError(
  response: Response,
  fallbackMessage: string,
): Promise<LiveHttpError> {
  const feedback = await readHttpFeedback(response);
  return new LiveHttpError({
    status: response.status,
    code: feedback.code,
    severity: feedback.severity,
    message: feedback.message ?? `${fallbackMessage} (${response.status})`,
  });
}

async function readHttpFeedback(
  response: Response,
): Promise<{ message?: string; code?: string; severity?: LiveFeedbackSeverity }> {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (contentType.includes("application/json")) {
    try {
      return feedbackFromJson(await response.json());
    } catch {
      return {};
    }
  }

  try {
    const text = (await response.text()).trim();
    return text ? { message: text } : {};
  } catch {
    return {};
  }
}

function feedbackFromJson(value: unknown): {
  message?: string;
  code?: string;
  severity?: LiveFeedbackSeverity;
} {
  if (!value || typeof value !== "object") {
    return {};
  }
  const record = value as Record<string, unknown>;
  const severity = readSeverity(record);
  const code = readString(record, "code") ?? readString(record, "errorCode");
  const message =
    readString(record, "message") ??
    readString(record, "error") ??
    readString(record, "warning") ??
    readString(record, "detail") ??
    readNestedMessage(record, "error") ??
    readNestedMessage(record, "warning");
  return { message, code, severity };
}

function readNestedMessage(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (!value || typeof value !== "object") {
    return undefined;
  }
  return readString(value as Record<string, unknown>, "message");
}

function readSeverity(record: Record<string, unknown>): LiveFeedbackSeverity | undefined {
  const value =
    readString(record, "severity") ?? readString(record, "level") ?? readString(record, "type");
  if (!value) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (normalized === "warning" || normalized === "warn") {
    return "warning";
  }
  if (normalized === "error") {
    return "error";
  }
  return undefined;
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
