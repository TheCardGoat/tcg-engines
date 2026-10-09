import type { Effect } from "@tcg/cyberpunk-types";

/** Readable fallback for DSL effect names in diagnostic action logs. */
export function effectLogName(effect: Effect): string {
  return effect.effect.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
}
