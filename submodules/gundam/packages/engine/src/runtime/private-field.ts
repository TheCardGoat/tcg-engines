/**
 * Field-level privacy for structured move logs.
 *
 * A move log can be public while specific fields remain visible only to
 * selected players. Delivery/rendering code can strip these recursively for
 * opponents or spectators without dropping the whole log entry.
 */

export interface PrivateField<T> {
  readonly __private: true;
  readonly value: T;
  readonly visibleTo: readonly string[];
}

export function privateField<T>(value: T, visibleTo: readonly string[]): PrivateField<T> {
  return { __private: true, value, visibleTo: [...visibleTo] };
}

function isPrivateField(value: unknown): value is PrivateField<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "__private" in value &&
    (value as PrivateField<unknown>).__private === true &&
    "value" in value &&
    "visibleTo" in value
  );
}

export function stripPrivateFields<T>(value: T, viewerId: string | null): T | undefined {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (isPrivateField(value)) {
    if (viewerId !== null && value.visibleTo.includes(viewerId)) {
      return value.value as T;
    }
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => stripPrivateFields(entry, viewerId)) as T;
  }

  const out: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    const original = (value as Record<string, unknown>)[key];
    const stripped = stripPrivateFields(original, viewerId);
    if (stripped === undefined && isPrivateField(original)) continue;
    out[key] = stripped;
  }
  return out as T;
}
