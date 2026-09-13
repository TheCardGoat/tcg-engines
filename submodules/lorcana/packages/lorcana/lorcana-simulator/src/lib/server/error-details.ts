export interface SerializedErrorDetails {
  name: string;
  message: string;
  code?: string;
  errno?: number | string;
  syscall?: string;
  address?: string;
  port?: number;
  cause?: SerializedErrorDetails;
  errors?: SerializedErrorDetails[];
}

type ErrorRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ErrorRecord {
  return typeof value === "object" && value !== null;
}

function getString(record: ErrorRecord, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" ? value : undefined;
}

function getNumber(record: ErrorRecord, key: string): number | undefined {
  const value = record[key];
  return typeof value === "number" ? value : undefined;
}

/**
 * Converts fetch errors into bounded structured fields suitable for logs.
 * In particular, Node puts the useful DNS/TCP failure on `error.cause`.
 */
export function serializeErrorDetails(error: unknown, depth = 0): SerializedErrorDetails {
  if (!isRecord(error)) {
    return { name: typeof error, message: String(error) };
  }

  const serialized: SerializedErrorDetails = {
    name: getString(error, "name") ?? "UnknownError",
    message: getString(error, "message") ?? String(error),
  };

  const code = getString(error, "code");
  const errno = error.errno;
  const syscall = getString(error, "syscall");
  const address = getString(error, "address");
  const port = getNumber(error, "port");

  if (code !== undefined) serialized.code = code;
  if (typeof errno === "string" || typeof errno === "number") serialized.errno = errno;
  if (syscall !== undefined) serialized.syscall = syscall;
  if (address !== undefined) serialized.address = address;
  if (port !== undefined) serialized.port = port;

  // Network errors are normally only two levels deep (fetch -> socket error).
  // Bound recursion so an unexpected cyclic/oversized error cannot flood logs.
  if (depth < 2 && error.cause !== undefined) {
    serialized.cause = serializeErrorDetails(error.cause, depth + 1);
  }

  if (depth < 2 && Array.isArray(error.errors) && error.errors.length > 0) {
    serialized.errors = error.errors
      .slice(0, 5)
      .map((nested) => serializeErrorDetails(nested, depth + 1));
  }

  return serialized;
}
