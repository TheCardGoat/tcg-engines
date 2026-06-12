/**
 * Field-level privacy for {@link MoveLog} entries.
 *
 * Wrap any sensitive value (e.g. the actual card ids drawn during a mulligan)
 * with {@link privateField}. Before delivering a log to a viewer, run it
 * through {@link stripPrivateFields} with the viewer's PlayerId — fields that
 * the viewer is not allowed to see are replaced with `undefined`.
 *
 * Spectators (and the AI driver, which sees both sides) pass `null` to strip
 * everything that's marked private regardless of the viewer.
 */

import type { PlayerId } from "../types/branded.ts";

export interface PrivateField<T> {
  readonly __private: true;
  readonly value: T;
  readonly visibleTo: readonly PlayerId[];
}

export function privateField<T>(value: T, visibleTo: readonly PlayerId[]): PrivateField<T> {
  return { __private: true, value, visibleTo };
}

function isPrivateField(obj: unknown): obj is PrivateField<unknown> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as { __private?: unknown }).__private === true &&
    "value" in (obj as object) &&
    "visibleTo" in (obj as object)
  );
}

/**
 * Recursively strip private fields from a value based on viewer identity.
 *
 * - If the viewer is in `visibleTo`, the PrivateField is unwrapped to its value.
 * - Otherwise, the PrivateField is replaced with `undefined`.
 * - `viewerId: null` (spectator) strips every private field.
 */
export function stripPrivateFields<T>(obj: T, viewerId: PlayerId | null): T {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  if (isPrivateField(obj)) {
    if (viewerId !== null && obj.visibleTo.includes(viewerId)) {
      return obj.value as T;
    }
    return undefined as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => stripPrivateFields(item, viewerId)) as T;
  }

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj as object)) {
    const stripped = stripPrivateFields((obj as Record<string, unknown>)[key], viewerId);
    if (stripped !== undefined) {
      result[key] = stripped;
    }
  }
  return result as T;
}
